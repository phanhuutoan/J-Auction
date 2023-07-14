import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(authCheck?: boolean): string {
    return !authCheck ? 'Hello World!' : 'Hello with authenticated user';
  }
}
