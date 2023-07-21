import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { BidAuctionDTO, CreateBidItemDTO } from 'src/common/DTOs/bidItem';
import { ActionResultState } from 'src/common/enums/commonEnums';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidation.pipe';
import { UtilService } from 'src/common/services/util.service';
import {
  createBidItemSchema,
  bidAuctionSchema,
} from 'src/common/validation/bid.schema';
import { BidItemStateEnum } from 'src/entities/BidItem.entity';
import { BidControllerService } from 'src/services/controller/bidController.service';

@Controller('/bid')
export class BidController {
  constructor(
    private bidControllerService: BidControllerService,
    private utilService: UtilService,
  ) {}

  @Post('/create')
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

  @Post('/start/:bidItemId')
  @UseGuards(AuthGuard)
  async startAuction(
    @Param('bidItemId') bidItemId: number,
    @Req() req: Request,
  ) {
    const triggerUserId = await this.utilService.getUserIdFromToken(req);

    await this.bidControllerService.updateStateOfBidItem(
      bidItemId,
      triggerUserId,
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

  @Get('/:bidItemId/list')
  @UseGuards(AuthGuard)
  async getBidsList(@Param('bidItemId', new ParseIntPipe()) bidItemId: number) {
    return this.bidControllerService.getBidListFromItem(bidItemId);
  }
}
