import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

interface EqualValidationArguments extends ValidationArguments {
  constraints: [string];
}

@ValidatorConstraint({ name: 'IsEqual' })
@Injectable()
export class IsEqualConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: EqualValidationArguments,
  ): boolean | Promise<boolean> {
    const [relatedProperty] = validationArguments.constraints;
    const relatedValue = (validationArguments.object as any)[relatedProperty];

    return value === relatedValue;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    const [relatedProperty] = validationArguments.constraints;
    return `${validationArguments.property} must match ${relatedProperty}`;
  }
}
