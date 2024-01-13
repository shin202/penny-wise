import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { IsEqual } from '../../shared/validation/is-equal';

export class PasswordResetDto {
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

  @IsEqual('password')
  @IsString()
  @IsNotEmpty()
  passwordConfirmation: string;
}
