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
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsUserPipe } from 'src/pipes/is-user.pipe';
import { ParseUserPipe } from 'src/pipes/parse-user.pipe';
import { LoginDTO, RegisterDTO, UserPatchDTO } from './auth.dto';
import {
  UserExistsException,
  UserNotFoundException,
  WrongPasswordException,
} from './auth.exceptions';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 409, description: 'User already exists.' })
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
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Wrong password.' })
  @ApiBody({ type: LoginDTO })
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
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async patchUser(
    @Param('userId', ParseIntPipe, ParseUserPipe, IsUserPipe) userId: number,
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
