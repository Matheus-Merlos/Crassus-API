import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
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
        throw new ConflictException('User with this e-mail already exists.');
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
        throw new NotFoundException('User not found.');
      else if (error instanceof WrongPasswordException)
        throw new BadRequestException('Wrong password.');
      else
        throw new HttpException(
          `Internal server error: ${(error as Error).message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
