import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserRegister {
  @ApiProperty()
  username: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  role?: string;

  @ApiProperty()
  password: string;
}

export class UserLogin {
  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiProperty()
  password: string;
}

export class UserLoginResponse {
  status: string;
  token: string;
}

export class RegisterResponse {
  message: string;
  user: object;
}
