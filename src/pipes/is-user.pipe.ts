import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

//De algum jeito que eu não sei como, isso aqui acessa a requisição
//Decorators em TypeScript são muito poderosos!
@Injectable({ scope: Scope.REQUEST })
export class IsUserPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  transform(value: number, metadata: ArgumentMetadata) {
    const authHeader = this.request.headers['authorization']!;

    const [, token] = authHeader.split(' ');
    const payload = jwt.verify(
      token,
      process.env.TOKEN_SECRET!,
    ) as jwt.JwtPayload & { id?: number };

    if (payload.id !== value)
      throw new UnauthorizedException(
        'User not authorized to access this resource',
      );

    return value;
  }
}
