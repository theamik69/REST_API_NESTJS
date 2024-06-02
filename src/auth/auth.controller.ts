import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  RegisterResponse,
  UserLogin,
  UserLoginResponse,
  UserRegister,
} from 'src/model/auth.model';
import { WebResponse } from 'src/model/web.model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: UserLogin })
  @Post()
  @HttpCode(HttpStatus.OK)
  async signin(@Body() body: UserLogin): Promise<UserLoginResponse> {
    // console.log(body);
    const { token } = await this.authService.login(body);
    return {
      status: 'success',
      token,
    };
  }

  @ApiBody({ type: UserRegister })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() body: UserRegister,
  ): Promise<WebResponse<RegisterResponse>> {
    const user = await this.authService.createUser(body);
    return {
      status: 'success',
      data: user,
    };
  }
}
