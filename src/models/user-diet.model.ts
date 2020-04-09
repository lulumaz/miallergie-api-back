import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Diet} from './diet.model';

@model()
export class UserDiet extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  @belongsTo(() => Diet)
  dietId: string;

  constructor(data?: Partial<UserDiet>) {
    super(data);
  }
}

export interface UserDietRelations {
  // describe navigational properties here
}

export type UserDietWithRelations = UserDiet & UserDietRelations;
