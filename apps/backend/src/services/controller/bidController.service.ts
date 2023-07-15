import { CreateBidItemDTO } from 'src/common/DTOs/bidItem';
import { BidItemService } from '../transports/bidItem.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BidControllerService {
  constructor(private bidItemService: BidItemService) {}

  createBidItem(userId: number, inputData: CreateBidItemDTO) {
    return this.bidItemService.create(userId, inputData);
  }
}
