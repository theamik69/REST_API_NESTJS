import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  RegisterResponse,
  UserLogin,
  UserRegister,
} from 'src/model/auth.model';
import { AuthValidation } from './auth.validation';

@Injectable()
export class AuthService {
  constructor(
    private validation: ValidationService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(request: UserRegister): Promise<RegisterResponse> {
    const credentials: UserRegister = this.validation.validate(
      AuthValidation.REGISTER,
      request,
    );

    const alreadyUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: credentials.email }, { username: credentials.username }],
      },
    });

    if (alreadyUser) {
      throw new UnauthorizedException('Credential not valid');
    }

    const password = await this.hashPassword(credentials.password);
    let role;
    if (credentials.role) {
      role = credentials.role.toUpperCase();
    }

    const user = await this.prisma.user.create({
      data: {
        ...credentials,
        role,
        password,
      },
    });

    return {
      message: 'user is created',
      user,
    };
  }

  async login(request: UserLogin) {
    const credentials: UserLogin = this.validation.validate(
      AuthValidation.LOGIN,
      request,
    );

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: credentials.email }, { username: credentials.username }],
      },
    });

    if (!user) throw new UnauthorizedException('Credential not valid');

    const validPassword = await this.comparePassword(
      credentials.password,
      user.password,
    );

    if (!validPassword) throw new UnauthorizedException('Credential not valid');

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);
    console.log(token);

    return {
      token,
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }
}
