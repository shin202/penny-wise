import { EntityTarget } from 'typeorm';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsExistsConstraint } from './is-exists.constraint';

export const IsExists = (
  entityTarget: EntityTarget<any>,
  property?: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [entityTarget, property || propertyName],
      options: validationOptions,
      validator: IsExistsConstraint,
    });
  };
};
