import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateBidItemDTO } from 'src/common/DTOs/bidItem';
import { ActionResultState } from 'src/common/enums/commonEnums';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidation.pipe';
import { UtilService } from 'src/common/services/util.service';
import { createBidItemSchema } from 'src/common/validation/bid.schema';
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
}
