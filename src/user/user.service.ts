import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { UserResponse, UserUpdate } from 'src/model/user.model';
import { UserValidation } from './user.validation';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validation: ValidationService,
  ) {}

  async updateUser(id: number, request: UserUpdate): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update( ${JSON.stringify(id)} , ${JSON.stringify(request)} )`,
    );

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const credentials: UserUpdate = this.validation.validate(
      UserValidation.UPDATE,
      request,
    );

    if (credentials.name) {
      user.name = credentials.name;
    }

    if (credentials.password) {
      user.password = await bcrypt.hash(credentials.password, 10);
    }

    const result = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });

    return result;
  }

  async getUserById(id: number): Promise<UserResponse> {
    this.logger.debug(`UserService.get( ${JSON.stringify(id)} )`);
    const result = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return result;
  }

  async getUsers(user: any): Promise<User> {
    this.logger.debug(`UserService.get()`);

    let result;
    if (user.role == 'ADMIN') {
      result = await this.prisma.user.findMany();
    } else {
      throw new ForbiddenException('Anauthorized');
    }
    return result;
  }

  async deleteUser(user: any, id: number): Promise<string> {
    this.logger.debug(`UserService.delete( ${JSON.stringify(id)} )`);

    const userCheck = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userCheck) {
      throw new BadRequestException('User not found');
    }

    let result;

    if (user.role == 'ADMIN') {
      result = await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } else {
      throw new ForbiddenException('Anauthorized');
    }

    return `User with id ${result.id} and username ${result.username} has been deleted`;
  }
}
