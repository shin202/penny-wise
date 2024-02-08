import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MatchConditions,
  PureAbility,
} from '@casl/ability';
import { Action } from '../constants';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { Income } from '../../incomes/entities/income.entity';

export type Subject = typeof Wallet | typeof Expense | typeof Income;
export type Subjects = InferSubjects<Subject> | 'all';
export type AppAbility = PureAbility<[Action, Subjects], MatchConditions>;

const conditionsMatcher = (matchConditions: MatchConditions) => matchConditions;
const AppAbility = PureAbility as AbilityClass<AppAbility>;

@Injectable()
export class AbilityFactory {
  defineAbilityFor(authUser: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(AppAbility);

    if (authUser) {
      can(Action.CREATE, 'all');
      can(
        Action.READ,
        Wallet,
        ({ user }) => user.username === authUser.username,
      );
      can(
        Action.UPDATE,
        Wallet,
        ({ user }) => user.username === authUser.username,
      );
      can(
        Action.DELETE,
        Wallet,
        ({ user }) => user.username === authUser.username,
      );
      can(
        Action.READ,
        Expense,
        ({ user }) => user.username === authUser.username,
      );
      can(
        Action.UPDATE,
        Expense,
        ({ user }) => user.username === authUser.username,
      );
      can(
        Action.DELETE,
        Expense,
        ({ user }) => user.username === authUser.username,
      );
      can(
        Action.READ,
        Income,
        ({ user }) => user.username === authUser.username,
      );
      can(
        Action.UPDATE,
        Income,
        ({ user }) => user.username === authUser.username,
      );
      can(
        Action.DELETE,
        Income,
        ({ user }) => user.username === authUser.username,
      );
    }

    return build({
      conditionsMatcher,
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
