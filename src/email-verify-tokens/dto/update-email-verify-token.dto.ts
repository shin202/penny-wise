import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailVerifyTokenDto } from './create-email-verify-token.dto';

export class UpdateEmailVerifyTokenDto extends PartialType(
  CreateEmailVerifyTokenDto,
) {}
