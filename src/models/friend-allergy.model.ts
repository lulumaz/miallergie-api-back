import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Allergy} from './allergy.model';

@model()
export class FriendAllergy extends Entity {
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

  @belongsTo(() => Allergy)
  allergyId: string;

  constructor(data?: Partial<FriendAllergy>) {
    super(data);
  }
}

export interface FriendAllergyRelations {
  // describe navigational properties here
}

export type FriendAllergyWithRelations = FriendAllergy & FriendAllergyRelations;
