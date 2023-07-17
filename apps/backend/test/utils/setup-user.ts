import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class SetupUser {
  private app: INestApplication<any>;
  private now = Date.now();

  constructor(app: INestApplication) {
    this.app = app;
  }

  async signupUser(email: string, userName: string, password: string) {
    const response = await request(this.app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `${email}_${this.now}@gmail.com`,
        password: password,
        userName: `${userName}_${this.now}`,
      })
      .expect(201);

    return response.body;
  }
}
