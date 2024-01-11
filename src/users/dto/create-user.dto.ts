import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUnique } from '../../shared';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsUnique(User, 'username')
  @MaxLength(20)
  @MinLength(4)
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsUnique(User, 'email')
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*.,])[A-Za-z0-9!@#$%^&*.,]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  @IsString()
  @IsNotEmpty()
  password: string;
}
