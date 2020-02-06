import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Food} from './food.model';

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

  constructor(data?: Partial<FoodAllergy>) {
    super(data);
  }
}

export interface FoodAllergyRelations {
  // describe navigational properties here
}

export type FoodAllergyWithRelations = FoodAllergy & FoodAllergyRelations;
