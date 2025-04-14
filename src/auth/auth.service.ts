import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  digest(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }
}
