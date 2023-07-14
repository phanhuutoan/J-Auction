import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupInputDTO } from 'src/common/DTOs/auths';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { AuthService } from '../business/auth.service';
import { forOwn } from 'lodash';

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

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepo.findOneBy({ id });
  }

  async updateUser(
    user: User,
    possibleUpdateField?: IPossibleUserUpdatedField,
  ) {
    forOwn(possibleUpdateField, (val, key: keyof IPossibleUserUpdatedField) => {
      val && (user[key] = val);
    });

    await this.userRepo.save(user);
  }

  private checkUserExist(email: string) {
    return this.userRepo.exist({ where: { email } });
  }
}
