import { SetMetadata } from '@nestjs/common';
import { Subjects } from '../providers/ability-factory.provider';

export const SET_ENTITY_KEY = 'set_entity';

export const SetEntity = (entity: Subjects) =>
  SetMetadata(SET_ENTITY_KEY, entity);
