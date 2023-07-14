import { Injectable } from '@nestjs/common';
import { UserService } from '../transports/user.service';

@Injectable()
export class UserControllerService {
  constructor(private userService: UserService) {}

  async updateUserBalance(userId: number, addedBalance: number) {
    const user = await this.userService.getUserById(userId);
    const newBalance = +user.balance + addedBalance;

    await this.userService.updateUser(user, { balance: newBalance });
  }
}
