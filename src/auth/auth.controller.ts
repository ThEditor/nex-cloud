import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthToken } from './struct';
import { GetUser, GetUserId, Public } from './decorator';
import { RtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  signupLocal(@Body() dto: AuthDto): Promise<AuthToken> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('local/signin')
  signinLocal(@Body() dto: AuthDto): Promise<AuthToken> {
    return this.authService.signinLocal(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@GetUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshTokens(
    @GetUserId() userId: number,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
