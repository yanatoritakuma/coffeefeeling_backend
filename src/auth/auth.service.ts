import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { Msg, Jwt } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  async signUp(dto: AuthDto): Promise<Msg> {
    const hashed = await bcrypt.hash(dto.password, 12);
    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword: hashed,
          name: dto.name,
          image: dto.image,
          admin: dto.admin,
        },
      });
      return {
        message: 'ok',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'このメールアドレスは既に使用されています',
          );
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<Jwt> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user)
      throw new ForbiddenException(
        'メールアドレスまたは、パスワードが正しくありません。',
      );
    // パスワードがDBに存在するのか
    const isValid = await bcrypt.compare(dto.password, user.hashedPassword);
    if (!isValid)
      throw new ForbiddenException(
        'メールアドレスまたは、パスワードが正しくありません。',
      );
    return this.generateJwt(user.id, user.email);
  }

  async generateJwt(userId: number, email: string): Promise<Jwt> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '999m',
      secret: secret,
    });
    return {
      accessToken: token,
    };
  }

  async deleteUserById(loginUserId: number, userId: number): Promise<void> {
    if (loginUserId !== userId)
      throw new ForbiddenException('No permision to delete');

    await this.prisma.user.delete({
      where: {
        id: loginUserId,
      },
    });
  }
}
