import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import * as jwt from 'jsonwebtoken';
import db from 'src/db';
import { user as userModel } from 'src/db/schema';
import { LoginDTO } from './auth.dto';
import {
  UserNotFoundException,
  WrongPasswordException,
} from './auth.exceptions';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.TOKEN_SECRET!;

  async login(request: LoginDTO) {
    const [user] = await db
      .select()
      .from(userModel)
      .where(eq(userModel.email, request.email));

    if (!user) throw new UserNotFoundException();

    const passwordWithSalt = this.digest(`${user.salt}${request.password}`);

    if (passwordWithSalt !== user.passwordHash)
      throw new WrongPasswordException();

    const token = jwt.sign(user, this.jwtSecret, { expiresIn: 15552000 });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userReturn } = user;

    return { ...userReturn, token };
  }

  private digest(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }
  private createSalt(lenght: number = 16): string {
    return randomBytes(lenght).toString('hex').substring(0, lenght);
  }
}
