import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/services/business/auth.service';

@Injectable()
export class UtilService {
  constructor(private authService: AuthService) {}

  async getUserIdFromToken(req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    const data = await this.authService.verifyJwtToken(token);

    if (data) {
      return data.userId;
    }

    return null;
  }
}
