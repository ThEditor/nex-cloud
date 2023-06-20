import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  me(@Req() req) {
    return {
      user: req.user,
    };
  }
}
