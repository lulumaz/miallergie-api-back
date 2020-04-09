import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Intolerance} from './intolerance.model';

@model()
export class FriendIntolerance extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Intolerance)
  intoleranceId: string;

  constructor(data?: Partial<FriendIntolerance>) {
    super(data);
  }
}

export interface FriendIntoleranceRelations {
  // describe navigational properties here
}

export type FriendIntoleranceWithRelations = FriendIntolerance & FriendIntoleranceRelations;
