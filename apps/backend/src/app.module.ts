import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/business/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidItem } from './entities/BidItem.entity';
import { Bid } from './entities/Bid.entity';
import { User } from './entities/User.entity';

import * as dotenv from 'dotenv';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/business/auth.service';
import { UserService } from './services/transports/user.service';
import { AuthControllerService } from './services/controller/authController.service';
import { UserControllerService } from './services/controller/userController.service';
import { UserController } from './controllers/user.controller';
import { UtilService } from './common/services/util.service';
import { BidItemService } from './services/transports/bidItem.service';
import { BidControllerService } from './services/controller/bidController.service';
import { BidController } from './controllers/bid.controller';
import { BidManagerService } from './services/business/bidManager.service';
import { BidService } from './services/transports/bid.service';
import { PreventedUserActionManager } from './services/business/PreventedUserAction.service';

dotenv.config();
const typeOrmModuleRoot = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [BidItem, Bid, User],
  synchronize: true,
});

@Module({
  imports: [typeOrmModuleRoot, TypeOrmModule.forFeature([BidItem, Bid, User])],
  controllers: [AppController, AuthController, UserController, BidController],
  providers: [
    AppService,
    AuthService,
    UserService,
    AuthControllerService,
    UserControllerService,
    UtilService,
    BidItemService,
    BidControllerService,
    BidManagerService,
    BidService,
    PreventedUserActionManager,
  ],
})
export class AppModule {}
