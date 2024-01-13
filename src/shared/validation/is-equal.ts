import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsEqualConstraint } from './is-equal.constraint';

export const IsEqual = (
  relatedProperty: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [relatedProperty],
      options: validationOptions,
      validator: IsEqualConstraint,
    });
  };
};
