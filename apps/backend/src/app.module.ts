import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/business/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidItem } from './entities/BidItem';
import { Bid } from './entities/Bid';
import { User } from './entities/User';

import * as dotenv from 'dotenv';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/business/auth.service';
import { UserService } from './services/transports/user.service';
import { AuthControllerService } from './services/controller/authController.service';
import { UserControllerService } from './services/controller/userController.service';
import { UserController } from './controllers/user.controller';
import { UtilService } from './common/services/util.service';

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
  controllers: [AppController, AuthController, UserController],
  providers: [
    AppService,
    AuthService,
    UserService,
    AuthControllerService,
    UserControllerService,
    UtilService,
  ],
})
export class AppModule {}
