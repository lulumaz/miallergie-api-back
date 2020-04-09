import {Entity, model, property, hasMany} from '@loopback/repository';
import {UserAllergy} from './user-allergy.model';
import {UserDiet} from './user-diet.model';
import {UserIntolerance} from './user-intolerance.model';
import {Friend} from './friend.model';
import {RegisteredFriend} from './registered-friend.model';

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
      uniqueUser: {
        keys: {
          username: 1,
        },
        options: {
          unique: true,
        },
      },
    },
    hiddenProperties: ['password'],
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createAt: string;

  @hasMany(() => UserAllergy)
  allergies: UserAllergy[];

  @hasMany(() => UserDiet)
  diets: UserDiet[];

  @hasMany(() => UserIntolerance)
  intolerances: UserIntolerance[];

  @hasMany(() => Friend)
  nonRegisteredFriends: Friend[];

  @hasMany(() => RegisteredFriend)
  registeredFriends: RegisteredFriend[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

export class Credentials {
  id: string;
  email: string;
  password: string;
}

@model()
export class NewUser extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}
