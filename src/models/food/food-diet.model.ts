import {Entity, model, property} from '@loopback/repository';

@model()
export class FoodDiet extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<FoodDiet>) {
    super(data);
  }
}

export interface FoodDietRelations {
  // describe navigational properties here
}

export type FoodDietWithRelations = FoodDiet & FoodDietRelations;
