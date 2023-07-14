import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
  userId: number;
  userEmail: string;
}

@Injectable()
export class AuthService {
  private readonly SALT = 5;
  private readonly JWT_SECRET = process.env.JWT_SECRET;
  private tokenLive = 8; // 8 hours exp

  encryptPassword(password: string) {
    return bcrypt.hashSync(password, this.SALT);
  }

  comparePassword(hashPassword: string, inputPassword: string) {
    return bcrypt.compareSync(inputPassword, hashPassword);
  }

  generateJwtToken(data: TokenPayload) {
    const jsonData = {
      ...data,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * this.tokenLive,
    };

    return jwt.sign(jsonData, this.JWT_SECRET);
  }

  verifyJwtToken(token: string) {
    return new Promise<TokenPayload>((resolve) => {
      jwt.verify(token, this.JWT_SECRET, (err, decoded: TokenPayload) => {
        if (err) {
          console.log('Token is malform');
          resolve(null);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
