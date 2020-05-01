import {UserAllergyWithRelations} from './user-allergy.model';
import {
  UserIntoleranceRelations,
  UserIntoleranceWithRelations,
} from './user-intolerance.model';
import {UserDietWithRelations} from './user-diet.model';
import {Entity, model, property, hasMany} from '@loopback/repository';
import {FriendAllergy} from './friend-allergy.model';
import {FriendDiet} from './friend-diet.model';
import {FoodIntolerance} from './food-intolerance.model';

@model()
export class Friend extends Entity {
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
  surname: string;

  @hasMany(() => FriendAllergy)
  allergies: FriendAllergy[];

  @hasMany(() => FriendDiet)
  diets: FriendDiet[];

  @hasMany(() => FoodIntolerance)
  intolerances: FoodIntolerance[];

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<Friend>) {
    super(data);
  }
}

export interface FriendRelations {
  // describe navigational properties here
  diets?: UserDietWithRelations[];
  allergies?: UserAllergyWithRelations[];
  intolerances?: UserIntoleranceWithRelations[];
}

export type FriendWithRelations = Friend & FriendRelations;
