import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupInputDTO } from 'src/common/DTOs/auths';
import { FindOptionsRelations, In, Repository } from 'typeorm';
import { AuthService } from '../business/auth.service';
import { forOwn, isNil } from 'lodash';
import { User } from 'src/entities/User.entity';
import { UserId } from '../business/Auction';

export interface IPossibleUserUpdatedField {
  name?: string;
  email?: string;
  balance?: number;
}
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private authService: AuthService,
  ) {}

  async createUser(userInput: SignupInputDTO) {
    const { email, password, userName } = userInput;
    const isUserExist = await this.checkUserExist(email);

    if (isUserExist) {
      throw new BadRequestException('This email has been registered!.');
    }

    const user = this.userRepo.create({
      email: email.trim(),
      password: this.authService.encryptPassword(password.trim()),
      userName: userName.trim(),
    });

    return this.userRepo.save(user);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ email });
  }

  async getUserDataById(
    userId: number,
    relations?: FindOptionsRelations<User>,
  ) {
    const data = await this.userRepo.findOne({
      where: { id: userId },
      relations,
    });

    return data;
  }

  async updateUser(
    user: User,
    possibleUpdateField?: IPossibleUserUpdatedField,
  ) {
    forOwn(possibleUpdateField, (val, key: keyof IPossibleUserUpdatedField) => {
      !isNil(val) && (user[key] = val);
    });

    await this.userRepo.save(user);
  }

  async getManyUsers(userIds: UserId[]) {
    return this.userRepo.find({ where: { id: In(userIds) } });
  }

  async updateManyUsers(
    users: User[],
    possibleUpdateFields?: IPossibleUserUpdatedField[],
  ) {
    const promises = users.map((user, index) => {
      return this.userRepo.update(user.id, possibleUpdateFields[index]);
    });

    return Promise.all(promises);
  }

  private checkUserExist(email: string) {
    return this.userRepo.exist({ where: { email } });
  }
}
