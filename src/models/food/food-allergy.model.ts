import {Entity, model, property} from '@loopback/repository';

@model()
export class FoodAllergy extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<FoodAllergy>) {
    super(data);
  }
}

export interface FoodAllergyRelations {
  // describe navigational properties here
}

export type FoodAllergyWithRelations = FoodAllergy & FoodAllergyRelations;
