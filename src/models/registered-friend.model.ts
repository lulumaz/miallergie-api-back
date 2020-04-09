import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class RegisteredFriend extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<RegisteredFriend>) {
    super(data);
  }
}

export interface RegisteredFriendRelations {
  // describe navigational properties here
}

export type RegisteredFriendWithRelations = RegisteredFriend & RegisteredFriendRelations;
