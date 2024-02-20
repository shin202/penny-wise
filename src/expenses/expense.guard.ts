import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactoryProvider } from '../common/providers/ability-factory.provider';
import { ExpensesService } from './expenses.service';
import { REQUIRES_PERMISSION_KEY } from '../common/decorators/requires-permission';
import { Action } from '../common/constants';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class ExpenseGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private abilityFactory: AbilityFactoryProvider,
    private readonly expenseService: ExpensesService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const permissions = this.reflector.get<Action[]>(
      REQUIRES_PERMISSION_KEY,
      context.getHandler(),
    );

    if (!permissions) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request & { user: User }>();
    const {
      user,
      params: { id },
    } = req;

    const ability = this.abilityFactory.defineAbilityFor(user);
    const expense = await this.expenseService.findOneOrFail(+id);

    try {
      permissions.forEach((permission) => {
        ForbiddenError.from(ability).throwUnlessCan(permission, expense);
      });

      return true;
    } catch (e) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
  }
}
