import { IsInt, IsNotEmpty } from 'class-validator';
import { IsExists } from '../../shared';
import { User } from '../../users';

export class CreateEmailVerifyTokenDto {
  @IsExists(User, 'id')
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
