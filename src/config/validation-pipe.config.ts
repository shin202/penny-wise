import {
  BadRequestException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

export const validationPipeConfig = (): ValidationPipeOptions => ({
  exceptionFactory: (errors: ValidationError[]) => {
    const result = errors.map((error: ValidationError) => ({
      property: error.property,
      message: error.constraints[Object.keys(error.constraints)[0]],
    }));

    return new BadRequestException(result);
  },
  stopAtFirstError: true,
});
