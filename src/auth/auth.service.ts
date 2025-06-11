import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { eq, InferSelectModel } from 'drizzle-orm';
import * as jwt from 'jsonwebtoken';
import db from 'src/db';
import { user, user as userModel } from 'src/db/schema';
import { LoginDTO, RegisterDTO, UserPatchDTO } from './auth.dto';
import {
  UserExistsException,
  UserNotFoundException,
  WrongPasswordException,
} from './auth.exceptions';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.TOKEN_SECRET!;

  async register(request: RegisterDTO) {
    let user: InferSelectModel<typeof userModel>;

    const [day, month, year] = request.birthdate.split('/');
    const birthdate = `${year}-${month}-${day}`;

    const salt = this.createSalt();

    try {
      [user] = await db
        .insert(userModel)
        .values({
          name: request.name,
          email: request.email,
          gender: request.gender as 'M' | 'F',
          salt,
          passwordHash: this.digest(`${salt}${request.password}`),
          height: request.height,
          weight: request.weight,
          birthdate,
        })
        .returning();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.toUpperCase().includes('UNIQUE')) {
          throw new UserExistsException();
        }
        throw new Error(error.message);
      }
    }

    return user!;
  }

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
    const { passwordHash, salt, ...userReturn } = user;

    return { ...userReturn, token };
  }

  async patchUser(userId: number, userPatchDTO: UserPatchDTO) {
    if (Object.keys(userPatchDTO).includes('birthdate')) {
      const [day, month, year] = userPatchDTO.birthdate.split('/');

      userPatchDTO.birthdate = `${year}-${month}-${day}`;
    }

    const [editedUser] = await db
      .update(user)
      .set(userPatchDTO)
      .where(eq(user.id, userId))
      .returning();

    return editedUser;
  }

  private digest(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }

  private createSalt(lenght: number = 16): string {
    return randomBytes(lenght).toString('hex').substring(0, lenght);
  }
}
