import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUniqueConstraint } from './is-unique.constraint';
import { EntityTarget } from 'typeorm';

export const IsUnique = (
  entityTarget: EntityTarget<any>,
  property?: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [entityTarget, property || propertyName],
      options: validationOptions,
      validator: IsUniqueConstraint,
    });
  };
};
