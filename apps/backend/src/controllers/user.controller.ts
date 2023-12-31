import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { UpdateBalanceDTO } from 'src/common/DTOs/user';
import { ActionResultState } from 'src/common/enums/commonEnums';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidation.pipe';
import { UtilService } from 'src/common/services/util.service';
import { updateBalanceValidationSchema } from 'src/common/validation/user.schema';
import { UserControllerService } from 'src/services/controller/userController.service';

@Controller('/user')
export class UserController {
  constructor(
    private userControllerService: UserControllerService,
    private utilService: UtilService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUser(@Req() req: Request) {
    const userId = await this.utilService.getUserIdFromToken(req);

    return this.userControllerService.getUserById(userId);
  }

  @UseGuards(AuthGuard)
  @Patch('/balance')
  @UsePipes(new JoiValidationPipe(updateBalanceValidationSchema))
  async updateBalance(
    @Body() updateBalanceInput: UpdateBalanceDTO,
    @Req() req: Request,
  ) {
    const updatedUserId = await this.utilService.getUserIdFromToken(req);
    const { balance } = updateBalanceInput;

    await this.userControllerService.updateUserBalance(updatedUserId, balance);

    return { status: ActionResultState.UPDATE_SUCCESS };
  }

  @UseGuards(AuthGuard)
  @Get('/bid-items')
  async getMyBidItems(@Req() req: Request) {
    const userId = await this.utilService.getUserIdFromToken(req);
    const data = await this.userControllerService.getUserBidItems(userId);

    return data;
  }
}
