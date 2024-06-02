import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserResponse, UserUpdate } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';

@Controller('user')
export class UserController {
  constructor(private articleService: UserService) {}

  @ApiBody({ type: UserUpdate })
  @UseGuards(AuthGuard)
  @Put('/:userId')
  @HttpCode(HttpStatus.OK)
  async updateArticle(
    @Param('userId', ParseIntPipe) id: number,
    @Body() body: UserUpdate,
    @Request() req,
  ): Promise<WebResponse<UserResponse>> {
    let userId;

    if (req.user.role == 'ADMIN') {
      userId = id;
    } else {
      userId = req.user.id;
    }

    const user = await this.articleService.updateUser(userId, body);
    return {
      status: 'success',
      data: user,
    };
  }

  @ApiBody({ type: UserResponse })
  @UseGuards(AuthGuard)
  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserById(
    @Param('userId', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<WebResponse<UserResponse>> {
    let userId;

    if (req.user.role == 'ADMIN') {
      userId = id;
    } else {
      userId = req.user.id;
    }

    const user = await this.articleService.getUserById(userId);
    return {
      status: 'success',
      data: user,
    };
  }

  @ApiBody({ type: UserResponse })
  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(@Request() req): Promise<WebResponse<UserResponse>> {
    const users = await this.articleService.getUsers(req.user);
    return {
      status: 'success',
      data: users,
    };
  }

  @ApiBody({ type: UserResponse })
  @UseGuards(AuthGuard)
  @Delete('/:userId')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('userId', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<WebResponse<UserResponse>> {
    const user = await this.articleService.deleteUser(req.user, id);
    return {
      status: 'success',
      message: user,
    };
  }
}
