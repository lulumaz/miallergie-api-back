import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<RegisteredFriend>) {
    super(data);
  }
}

export interface RegisteredFriendRelations {
  // describe navigational properties here
}

export type RegisteredFriendWithRelations = RegisteredFriend &
  RegisteredFriendRelations;
