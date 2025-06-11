import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ParseUserPipe } from 'src/pipes/parse-user.pipe';
import { LoginDTO, RegisterDTO, UserPatchDTO } from './auth.dto';
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

  @Patch('user/:userId')
  async patchUser(
    @Param('userId', ParseIntPipe, ParseUserPipe) userId: number,
    @Body() body: UserPatchDTO,
  ) {
    try {
      return await this.authService.patchUser(userId, body);
    } catch (error) {
      throw new HttpException(
        `Internal server error: ${(error as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
