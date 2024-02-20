import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactoryProvider } from '../common/providers/ability-factory.provider';
import { Action } from '../common/constants';
import { REQUIRES_PERMISSION_KEY } from '../common/decorators/requires-permission';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { IncomesService } from './incomes.service';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class IncomeGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: AbilityFactoryProvider,
    private readonly incomeService: IncomesService,
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
    const income = await this.incomeService.findOneOrFail(+id);

    try {
      permissions.forEach((permission) => {
        ForbiddenError.from(ability).throwUnlessCan(permission, income);
      });
    } catch (e) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
  }
}
