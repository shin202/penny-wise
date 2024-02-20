import { Injectable } from '@nestjs/common';
import { Order } from '../constants';

@Injectable()
export class TransformQueryParamsProvider {
  transformOrder(alias: string, order: Record<string, Order>) {
    const orderKeys = Object.keys(order);

    return orderKeys.reduce((acc, key) => {
      const orderValue = order[key];
      const orderKey = `${alias}.${key}`;
      acc[orderKey] = orderValue;

      return acc;
    }, {});
  }
}
