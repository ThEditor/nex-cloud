import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';

@Controller('users')
export class UserController {
  @Get('me')
  me(@GetUser() user: User) {
    return {
      user,
    };
  }
}
