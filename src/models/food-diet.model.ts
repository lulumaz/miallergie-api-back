import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Food} from './food.model';
import {Diet} from './diet.model';

@model()
export class FoodDiet extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Food)
  foodId: string;

  @belongsTo(() => Diet)
  dietId: string;

  constructor(data?: Partial<FoodDiet>) {
    super(data);
  }
}

export interface FoodDietRelations {
  // describe navigational properties here
}

export type FoodDietWithRelations = FoodDiet & FoodDietRelations;
