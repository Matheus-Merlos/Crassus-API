import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register() {}

  @Post('login')
  login(@Body('body') body: LoginDTO) {}
}
