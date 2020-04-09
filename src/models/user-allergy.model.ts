import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Allergy} from './allergy.model';

@model()
export class UserAllergy extends Entity {
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

  @belongsTo(() => Allergy)
  allergyId: string;

  constructor(data?: Partial<UserAllergy>) {
    super(data);
  }
}

export interface UserAllergyRelations {
  // describe navigational properties here
}

export type UserAllergyWithRelations = UserAllergy & UserAllergyRelations;
