import { Injectable } from '@nestjs/common';
import { UserService } from '../transports/user.service';

@Injectable()
export class UserControllerService {
  constructor(private userService: UserService) {}

  async updateUserBalance(userId: number, addedBalance: number) {
    const user = await this.userService.getUserDataById(userId);
    // Sometime the validator convert fail so we have to make sure it's a number
    const newBalance = +user.balance + Number(addedBalance);

    await this.userService.updateUser(user, { balance: newBalance });
  }

  async getUserBidItems(userId: number) {
    const user = await this.userService.getUserDataById(userId, {
      bidItems: true,
    });
    return user.bidItems;
  }

  async getUserById(userId: number) {
    const data = await this.userService.getUserDataById(userId);

    delete data.password;
    return data;
  }
}
