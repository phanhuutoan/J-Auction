import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from '../services/business/app.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Using for health check
   * @returns void
   */
  @Get('/healthz')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/healthz-auth')
  @UseGuards(AuthGuard)
  getAuthHello(): string {
    return this.appService.getHello(true);
  }
}
