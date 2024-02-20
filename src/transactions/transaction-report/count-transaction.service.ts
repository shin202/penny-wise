import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class CountTransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getCount(req: Request & { user: User }) {
    const queryBuilder =
      this.transactionRepository.createQueryBuilder('transaction');

    queryBuilder
      .andWhere('user.id = :userId', { userId: req.user.id })
      .leftJoin('transaction.user', 'user')
      .select([
        `COUNT(*) AS count`,
        'transaction.transactionType AS transactionType',
      ])
      .groupBy('transactionType');

    const queryResult: {
      count: string;
      transactionType: string;
    }[] = await queryBuilder.getRawMany();

    const transactionCount: number = queryResult.reduce((acc, curr) => {
      return Number(acc) + Number(curr.count);
    }, 0);

    const totalTransactionsByType = queryResult.map((each) => {
      return {
        transactionType: each.transactionType,
        count: Number(each.count),
      };
    });

    return {
      transactionCount,
      totalTransactionsByType,
    };
  }
}
