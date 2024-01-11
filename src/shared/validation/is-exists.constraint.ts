import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

interface ExistsValidationArguments<E> extends ValidationArguments {
  constraints: [EntityTarget<E>, string];
}

@ValidatorConstraint({ name: 'isExists', async: true })
@Injectable()
export class IsExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate<E>(
    value: any,
    validationArguments?: ExistsValidationArguments<E>,
  ): Promise<boolean> {
    const [entityTarget, property = validationArguments.property] =
      validationArguments.constraints;

    const repository: Repository<E> =
      this.entityManager.getRepository(entityTarget);
    const tableName: string = repository.metadata.tableName;

    return await repository
      .createQueryBuilder(tableName)
      .where({ [property]: value })
      .getExists();
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const [entityTarget] = validationArguments.constraints;
    const entity = entityTarget.name || 'Entity';
    return `${entity} with this ${validationArguments.property} does not exist`;
  }
}
