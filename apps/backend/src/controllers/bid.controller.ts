import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import {
  BidAuctionDTO,
  CreateBidItemDTO,
  StartBidDTO,
} from 'src/common/DTOs/bidItem';
import { ActionResultState } from 'src/common/enums/commonEnums';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidation.pipe';
import { UtilService } from 'src/common/services/util.service';
import {
  createBidItemSchema,
  bidAuctionSchema,
  startBidSchema,
} from 'src/common/validation/bid.schema';
import { BidItemStateEnum } from 'src/entities/BidItem.entity';
import { BidControllerService } from 'src/services/controller/bidController.service';

@Controller('/bid')
export class BidController {
  constructor(
    private bidControllerService: BidControllerService,
    private utilService: UtilService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new JoiValidationPipe(createBidItemSchema))
  async createBidItem(
    @Body() bidItemInput: CreateBidItemDTO,
    @Req() req: Request,
  ) {
    const userId = await this.utilService.getUserIdFromToken(req);

    await this.bidControllerService.createBidItem(userId, bidItemInput);

    return {
      status: ActionResultState.CREATE_BID_ITEM_SUCCESS,
    };
  }

  @Post('/start')
  @UseGuards(AuthGuard)
  @UsePipes(new JoiValidationPipe(startBidSchema))
  async startAuction(@Body() data: StartBidDTO, @Req() req: Request) {
    const triggeringUserId = await this.utilService.getUserIdFromToken(req);
    if (triggeringUserId !== data.createdById) {
      throw new ForbiddenException(
        "You cannot start an auction that you don't own",
      );
    }

    await this.bidControllerService.updateStateOfBidItem(
      data.bidItemId,
      data.timeWindow,
      BidItemStateEnum.ONGOING,
    );

    return {
      status: ActionResultState.START_AUCTION_SUCCESS,
    };
  }

  @Post('/:bidItemId')
  @UseGuards(AuthGuard)
  async createBidOnAuction(
    @Body(new JoiValidationPipe(bidAuctionSchema)) data: BidAuctionDTO,
    @Param('bidItemId', new ParseIntPipe()) bidItemId: number,
    @Req() req: Request,
  ) {
    const biddingUserId = await this.utilService.getUserIdFromToken(req);

    await this.bidControllerService.createBidOnAuction({
      bidItemId,
      biddingUserId,
      price: data.price,
    });
    return {
      status: ActionResultState.BID_AUCTION_SUCCESS,
      price: data.price,
    };
  }
}
