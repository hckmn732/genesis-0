import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
// @UseGuards(JwtAuthGuard)
export class UserController {
  @Get('test')
  getTestData() {
    return [
      {
        name: 'Yann',
        email: 'gaelfomen@gmail.com',
        password: 'Elfomen',
      },
    ];
  }
}
