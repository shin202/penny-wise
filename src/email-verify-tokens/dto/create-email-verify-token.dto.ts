import { IsInt, IsNotEmpty } from 'class-validator';
import { IsExists } from '../../shared/validation/is-exists';
import { User } from '../../users/entities/user.entity';

export class CreateEmailVerifyTokenDto {
  @IsExists(User, 'id')
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
