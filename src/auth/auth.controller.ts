import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO, SignupDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() { email, password }: LoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('signup')
  signup(@Body() data: SignupDTO) {
    return this.authService.signup(data);
  }
}
