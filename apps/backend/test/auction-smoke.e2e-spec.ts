import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { SetupUser } from './utils/setup-user';

jest.setTimeout(15000);

describe('Bid Auction (e2e)', () => {
  let app: INestApplication;
  let setupUser: SetupUser;
  let bearerToken: string;
  let bidItemId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    setupUser = new SetupUser(app);
    const { token } = await setupUser.signupUser(
      'test-user',
      'test-user',
      'Toan1234',
    );
    bearerToken = `bearer ${token}`;
  });

  it('update user balance [/user/balance]', () => {
    return request(app.getHttpServer())
      .patch('/user/balance')
      .send({
        balance: 1000,
      })
      .set('authorization', bearerToken)
      .expect(200);
  });

  it('create bid item [/bid/create]', () => {
    return request(app.getHttpServer())
      .post('/bid/create')
      .send({
        title: 'A Test Auction',
        body: 'teaspoon from micheal Mr Tommy 15',
        timeWindow: 2,
        startPrice: 0,
      })
      .set('authorization', bearerToken)
      .expect(201);
  });

  it('/user/bid-items', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/bid-items')
      .set('authorization', bearerToken)
      .expect(200);

    expect(response.body.length).toBe(1);
    console.log('RESP', response.body);
    bidItemId = response.body[0].id;
  });

  it('User cannot bid on private bidItem [/bid/:bidItemId]', async () => {
    const response = await request(app.getHttpServer())
      .post(`/bid/${bidItemId}`)
      .send({
        price: 100,
      })
      .set('authorization', bearerToken)
      .expect(404);

    expect(response.body).toEqual({
      error: 'Not Found',
      message: 'This auction is completed or not publish yet',
      statusCode: 404,
    });
  });

  it('Users can only start an auction they own [/bid/start/:bidItemId]', async () => {
    await request(app.getHttpServer())
      .post(`/bid/start/${bidItemId}`)
      .set('authorization', bearerToken)
      .expect(201);
  });

  it('Users can only bid on ongoing auctoin [/bid/:bidItemId]', async () => {
    await request(app.getHttpServer())
      .post(`/bid/start/${bidItemId}`)
      .set('authorization', bearerToken)
      .expect(201);

    await new Promise((r) => setTimeout(r, 5000));
    await request(app.getHttpServer())
      .post(`/bid/${bidItemId}`)
      .send({
        price: 100,
      })
      .set('authorization', bearerToken)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
