import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { BackupAuction } from 'src/entities/BackupAuction.entity';
import { Repository } from 'typeorm';

export interface IBackupAuctionInput {
  auctionId: number;
  remainingTime: number;
  joinedUserIds: string;
  currentWinner: string;
}

@Injectable()
export class BackupAuctionService {
  constructor(
    @InjectRepository(BackupAuction)
    private backupRepo: Repository<BackupAuction>,
  ) {}

  async getAllCurrentBackup() {
    return this.backupRepo.find();
  }

  async create(input: IBackupAuctionInput) {
    const { auctionId, remainingTime, joinedUserIds, currentWinner } = input;
    const backup = this.backupRepo.create({
      auctionId,
      remainingTime,
      joinedUserIds,
      currentWinner,
    });

    return this.backupRepo.save(backup);
  }

  async update(id: number, input: IBackupAuctionInput) {
    if (!input.currentWinner) {
      input = omit(input, 'currentUser');
    }
    return this.backupRepo.update(id, input);
  }

  async deleteBackup(id: number) {
    return this.backupRepo.delete(id);
  }
}
