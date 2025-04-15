import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LoginDTO } from './auth.dto';
import {
  UserNotFoundException,
  WrongPasswordException,
} from './auth.exceptions';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register() {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDTO) {
    try {
      return await this.authService.login(body);
    } catch (error) {
      if (error instanceof UserNotFoundException)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      else if (error instanceof WrongPasswordException)
        throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
      else
        throw new HttpException(
          `Internal server error: ${(error as Error).message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
