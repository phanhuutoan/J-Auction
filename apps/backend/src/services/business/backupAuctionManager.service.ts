import { Injectable } from '@nestjs/common';
import {
  BackupAuctionService,
  IBackupAuctionInput,
} from '../transports/backupAuction.service';
import { CurrentWinner, UserId } from './Auction';
import { BackupAuction } from 'src/entities/BackupAuction.entity';

export interface IRawBackupAuctionData {
  auctionId: number;
  remainingTime: number; // in minutes
  joinedUserIds: UserId[];
  currentWinner: CurrentWinner;
}

@Injectable()
export class BackupAuctionManagerService {
  constructor(private backupAuctionService: BackupAuctionService) {}

  async preriodicallyBackup(rawBackupData: IRawBackupAuctionData[]) {
    const rawBackupMap = new Map(
      rawBackupData.map((ele) => [ele.auctionId, ele]),
    );
    const backupOnDb = await this.backupAuctionService.getAllCurrentBackup();
    const dbBackupMap = new Map(backupOnDb.map((ele) => [ele.auctionId, ele]));

    backupOnDb.forEach((dbBackup) => {
      // Delete backup auction has complete
      const rawBackup = rawBackupMap.get(dbBackup.auctionId);
      if (!rawBackup) {
        this.backupAuctionService.deleteBackup(dbBackup.id);
      } else {
        // update auction is ongoing
        this.backupAuctionService.update(
          dbBackup.id,
          this.convertRawToDbBackup(rawBackup),
        );
      }
    });

    rawBackupData.forEach((raw) => {
      // When DB doesn't have this backup we create new one
      if (!dbBackupMap.has(raw.auctionId)) {
        this.backupAuctionService.create(this.convertRawToDbBackup(raw));
      }
    });
  }

  async restoreBackup() {
    const allBackup = await this.backupAuctionService.getAllCurrentBackup();

    return allBackup.map((b) => {
      return this.convertFromDBBackupToRaw(b);
    });
  }

  private convertRawToDbBackup(
    rawBackup: IRawBackupAuctionData,
  ): IBackupAuctionInput {
    const {
      auctionId,
      remainingTime,
      joinedUserIds: rawJoinedIds,
      currentWinner: rawWinner,
    } = rawBackup;
    return {
      auctionId,
      remainingTime,
      joinedUserIds: rawJoinedIds.join('|'),
      currentWinner: `${rawWinner.userId}|${rawWinner.highestPrice}`,
    };
  }

  private convertFromDBBackupToRaw(
    dbBackup: BackupAuction,
  ): IRawBackupAuctionData {
    const { auctionId, remainingTime, joinedUserIds, currentWinner } = dbBackup;
    const currentWinnerArr = currentWinner.split('|');

    return {
      auctionId,
      remainingTime,
      joinedUserIds: joinedUserIds.split('|').map((ele) => Number(ele)),
      currentWinner: {
        userId: Number(currentWinnerArr[0]),
        highestPrice: Number(currentWinnerArr[1]),
      },
    };
  }
}
