import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthToken } from './struct';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signup')
  signupLocal(@Body() dto: AuthDto): Promise<AuthToken> {
    return this.authService.signupLocal(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('local/signin')
  signinLocal(@Body() dto: AuthDto): Promise<AuthToken> {
    return this.authService.signinLocal(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout() {
    // return this.authService.logout();
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshTokens() {
    return this.authService.refreshTokens();
  }
}
