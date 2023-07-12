import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './struct';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
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

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ForbiddenException('Credentials taken');
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if doesnt exist or password doesnt match, throw invalid credentials error
    if (!user || !(await argon.verify(user.hash, dto.password)))
      throw new ForbiddenException('Invalid credentials');

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string) {
    const payload: JwtPayload = {
      sub: userId,
      email,
      issuedAt: new Date(),
    };
    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: '12h',
        secret: this.config.get('JWT_SECRET'),
      }),
    };
  }
}
