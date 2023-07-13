import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/transports/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidItem } from './entities/BidItem';
import { Bid } from './entities/Bid';
import { User } from './entities/User';

import * as dotenv from 'dotenv';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
