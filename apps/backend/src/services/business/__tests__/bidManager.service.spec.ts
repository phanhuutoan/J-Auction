// showcase of isolated UT

import { Test } from '@nestjs/testing';
import { BidManagerService } from '../bidManager.service';
import { BidItemService } from 'src/services/transports/bidItem.service';
import { BidService } from 'src/services/transports/bid.service';
import { UserService } from 'src/services/transports/user.service';
import { BackupAuctionManagerService } from '../backupAuctionManager.service';
import { BidItemStateEnum } from 'src/entities/BidItem.entity';
import { UnprocessableEntityException } from '@nestjs/common';

const rawData = [
  {
    auctionId: 1,
    remainingTime: 2.5, // 2.5 minutes
    currentWinner: {
      userId: 1,
      price: 200,
    },
    joinedUserIds: [4, 3],
  },
  {
    auctionId: 2,
    remainingTime: 5, // 2.5 minutes
    currentWinner: {
      userId: 2,
      price: 200,
    },
    joinedUserIds: [2, 3],
  },
];
jest.useFakeTimers();
// 1. We override all other dependent service using service mock
const bidItemServiceMock = {
  updateBidItem: jest.fn(),
  updateWinner: jest.fn(),
};
const bidServiceMock = {
  getMoneyLosedUserBidInAuction: jest.fn().mockResolvedValue([
    {
      userId: 4,
      maxprice: 150,
    },
    {
      userId: 3,
      maxprice: 50,
    },
  ]),
};
const userServiceMock = {
  getManyUsers: jest.fn().mockResolvedValue([
    {
      id: 4,
      balance: 150,
    },
    {
      id: 3,
      balance: 250,
    },
  ]),
  updateManyUsers: jest.fn().mockResolvedValue(undefined),
};
const backupServiceMock = {
  preriodicallyBackup: jest.fn(),
  restoreBackup: jest.fn().mockResolvedValue(rawData),
};

describe('Bid Manager Service (BidManagerService)', () => {
  // 2. We only try to test on the targeting service; in this case is BidManagerService
  let testingService: BidManagerService;

  beforeAll(async () => {
    const testModule = Test.createTestingModule({
      providers: [
        BidItemService,
        BidService,
        UserService,
        BackupAuctionManagerService,
        BidManagerService,
      ],
    });
    // 3. Overide on dependent service with mock service above
    testModule.overrideProvider(BidItemService).useValue(bidItemServiceMock);
    testModule.overrideProvider(BidService).useValue(bidServiceMock);
    testModule.overrideProvider(UserService).useValue(userServiceMock);
    testModule
      .overrideProvider(BackupAuctionManagerService)
      .useValue(backupServiceMock);

    const compiledModule = await testModule.compile();
    // 3. Get the service we want to test
    testingService = compiledModule.get(BidManagerService);
  });

  it('should restore the data from the backup table', () => {
    expect(backupServiceMock.restoreBackup).toHaveBeenCalled();
    const onGoingAuctionMap = testingService.getAllOnGoingAuctions();

    expect(onGoingAuctionMap.size).toBe(2);
    onGoingAuctionMap.forEach((_2, id) => {
      expect([1, 2].includes(id)).toBe(true);
    });
  });

  it('should backup data after 5s interval', () => {
    jest.advanceTimersByTime(5000);
    const rawDataAfter5s = [
      {
        ...rawData[0],
        remainingTime: 2.42,
      },
      {
        ...rawData[1],
        remainingTime: 4.92,
      },
    ];
    expect(backupServiceMock.preriodicallyBackup).toHaveBeenCalledWith(
      rawDataAfter5s,
    );
  });

  it('should start an auction with true behavior', async () => {
    await testingService.startAution(10, 5);

    expect(bidItemServiceMock.updateBidItem).toHaveBeenCalledWith(10, {
      state: BidItemStateEnum.ONGOING,
    });
    const auctions = testingService.getAllOnGoingAuctions();
    expect(auctions.size).toBe(3);
  });

  it("should add highest price if it's definitely the highest one", () => {
    testingService.addHighestPrice({
      bidItemId: 1,
      biddingUserId: 1,
      price: 200,
    });

    let checkResult = testingService.checkHighestPrice({
      bidItemId: 1,
      biddingUserId: 1,
      price: 200,
    });

    expect(checkResult).toEqual(
      new UnprocessableEntityException(
        `Your price is not the highest one, the current highest price is $"200". Please, try again!`,
      ),
    );

    checkResult = testingService.checkHighestPrice({
      bidItemId: 1,
      biddingUserId: 1,
      price: 300,
    });

    expect(checkResult).toBe(true);
  });

  it('Should get remainingTime from an auction', async () => {
    let timeInMinutes = testingService.getRemainingTimeFromAuction(1);
    expect(timeInMinutes).toBe('2.42');
    jest.advanceTimersByTime(5000);
    timeInMinutes = testingService.getRemainingTimeFromAuction(1);
    expect(timeInMinutes).toBe('2.33');
  });

  it('should update winner and send money back to losed user when an auction end.', async () => {
    // ending auction 1
    jest.advanceTimersByTime(2.8 * 1000 * 60);
    await expect(bidItemServiceMock.updateWinner).toHaveBeenCalledWith(1, 1);
    await expect(
      bidServiceMock.getMoneyLosedUserBidInAuction,
    ).toHaveBeenCalled();
    await expect(userServiceMock.getManyUsers).toHaveBeenCalled();
    await expect(userServiceMock.updateManyUsers).toHaveBeenCalledWith(
      [
        { balance: 150, id: 4 },
        { balance: 250, id: 3 },
      ],
      [{ balance: 300 }, { balance: 300 }],
    );
    await expect(bidItemServiceMock.updateBidItem).toHaveBeenCalledWith(1, {
      state: BidItemStateEnum.COMPLETED,
    });
    const allAuctions = testingService.getAllOnGoingAuctions();
    expect(allAuctions.has(1)).toBe(false);
  });
});
