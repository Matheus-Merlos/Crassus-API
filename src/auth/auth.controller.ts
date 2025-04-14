import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './auth.dto';
import {
  UserExistsException,
  UserNotFoundException,
  WrongPasswordException,
} from './auth.exceptions';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    try {
      return await this.authService.register(body);
    } catch (error) {
      if (error instanceof UserExistsException)
        throw new HttpException(
          'User with this e-mail already exists.',
          HttpStatus.CONFLICT,
        );
      else
        throw new HttpException(
          `Internal server error: ${(error as Error).message}.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDTO) {
    try {
      return await this.authService.login(body);
    } catch (error) {
      if (error instanceof UserNotFoundException)
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      else if (error instanceof WrongPasswordException)
        throw new HttpException('Wrong password.', HttpStatus.BAD_REQUEST);
      else
        throw new HttpException(
          `Internal server error: ${(error as Error).message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
