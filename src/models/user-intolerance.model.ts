import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Intolerance} from './intolerance.model';

@model()
export class UserIntolerance extends Entity {
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

  @belongsTo(() => Intolerance)
  intoleranceId: string;

  constructor(data?: Partial<UserIntolerance>) {
    super(data);
  }
}

export interface UserIntoleranceRelations {
  // describe navigational properties here
}

export type UserIntoleranceWithRelations = UserIntolerance & UserIntoleranceRelations;
