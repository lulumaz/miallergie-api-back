import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Diet} from './diet.model';

@model()
export class FriendDiet extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  friendId?: string;

  @belongsTo(() => Diet)
  dietId: string;

  constructor(data?: Partial<FriendDiet>) {
    super(data);
  }
}

export interface FriendDietRelations {
  // describe navigational properties here
}

export type FriendDietWithRelations = FriendDiet & FriendDietRelations;
