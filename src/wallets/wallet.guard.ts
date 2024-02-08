import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../common/providers/ability.factory';
import { WalletsService } from './wallets.service';
import { Action } from '../common/constants';
import { REQUIRES_PERMISSION_KEY } from '../common/decorators/requires-permission';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class WalletGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: AbilityFactory,
    private readonly walletService: WalletsService,
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
    const wallet: Wallet = await this.walletService.findOrFail(Number(id));

    try {
      permissions.forEach((permission) => {
        ForbiddenError.from(ability).throwUnlessCan(permission, wallet);
      });

      return true;
    } catch (e) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
  }
}
