import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Food} from './food.model';
import {Allergy} from './allergy.model';

@model()
export class FoodAllergy extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Food)
  foodId: string;

  @belongsTo(() => Allergy)
  allergyId: string;

  constructor(data?: Partial<FoodAllergy>) {
    super(data);
  }
}

export interface FoodAllergyRelations {
  // describe navigational properties here
  allergy?: Allergy;
}

export type FoodAllergyWithRelations = FoodAllergy & FoodAllergyRelations;
