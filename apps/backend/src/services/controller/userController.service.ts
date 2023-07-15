import { Injectable } from '@nestjs/common';
import { UserService } from '../transports/user.service';

@Injectable()
export class UserControllerService {
  constructor(private userService: UserService) {}

  async updateUserBalance(userId: number, addedBalance: number) {
    const user = await this.userService.getUserDataById(userId);
    const newBalance = +user.balance + addedBalance;

    await this.userService.updateUser(user, { balance: newBalance });
  }

  async getUserBidItems(userId: number) {
    const user = await this.userService.getUserDataById(userId, {
      bidItems: true,
    });
    return user.bidItems;
  }
}
