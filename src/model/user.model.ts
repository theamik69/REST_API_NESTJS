import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserUpdate {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  role?: string;

  @ApiProperty()
  password: string;
}

export class UserResponse {
  id: number;
  name: string;
  email: string;
}
