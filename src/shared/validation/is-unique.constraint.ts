import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [EntityTarget<E>, string];
}

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate<E>(
    value: any,
    validationArguments?: UniqueValidationArguments<E>,
  ): Promise<boolean> {
    const [entityTarget, property = validationArguments.property] =
      validationArguments.constraints;

    const repository: Repository<E> =
      this.entityManager.getRepository(entityTarget);
    const tableName: string = repository.metadata.tableName;

    const query: number = await repository
      .createQueryBuilder(tableName)
      .where({ [property]: value })
      .getCount();

    return query <= 0;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const [entityTarget] = validationArguments.constraints;
    const entity = entityTarget.name || 'Entity';
    return `${entity} with this ${validationArguments.property} already exists`;
  }
}
