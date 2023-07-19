import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthToken, JwtPayload } from './struct';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signupLocal(dto: AuthDto): Promise<AuthToken> {
    // create password hash
    const hash = await argon.hash(dto.password);

    try {
      // store user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      const tokens = await this.signToken(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ForbiddenException('Credentials taken');
      throw error;
    }
  }

  async signinLocal(dto: AuthDto): Promise<AuthToken> {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if doesnt exist or password doesnt match, throw invalid credentials error
    if (!user || !(await argon.verify(user.hash, dto.password)))
      throw new ForbiddenException('Invalid credentials');

    const tokens = await this.signToken(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refreshTokens(userId: number, rt: string): Promise<AuthToken> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashedRt || !(await argon.verify(user.hashedRt, rt)))
      throw new ForbiddenException('Invalid credentials');

    const { access_token } = await this.signToken(user.id, user.email);

    return {
      access_token,
      refresh_token: rt,
    };
  }

  async signToken(userId: number, email: string): Promise<AuthToken> {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: 60 * 15,
        secret: this.config.get<string>('JWT_SECRET'),
      }),
      this.jwt.signAsync(payload, {
        expiresIn: 60 * 60 * 24 * 7,
        secret: this.config.get<string>('JWT_SECRET'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, rt: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: await argon.hash(rt),
      },
    });
  }
}
