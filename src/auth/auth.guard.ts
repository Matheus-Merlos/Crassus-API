import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret = process.env.TOKEN_SECRET!;

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers['authorization']!.split(' ') ?? [];

    if (type !== 'Bearer')
      throw new HttpException(
        'Invalid type of authorization token',
        HttpStatus.BAD_REQUEST,
      );

    if (!token)
      throw new HttpException('Token not found', HttpStatus.BAD_REQUEST);

    try {
      const payload = jwt.verify(token, this.jwtSecret);

      request['user'] = payload;
    } catch {
      throw new HttpException(
        'Invalid authorization token',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
