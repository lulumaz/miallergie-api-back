import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User, UserWithRelations} from './user.model';

@model()
export class RegisteredFriend extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  ownerUserId?: string;

  @belongsTo(() => User)
  friendUserId: string;

  constructor(data?: Partial<RegisteredFriend>) {
    super(data);
  }
}

export interface RegisteredFriendRelations {
  // describe navigational properties here
  friendUser?: UserWithRelations;
}

export type RegisteredFriendWithRelations = RegisteredFriend &
  RegisteredFriendRelations;
