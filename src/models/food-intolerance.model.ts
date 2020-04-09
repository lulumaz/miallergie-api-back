import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Food} from './food.model';

@model()
export class FoodIntolerance extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Food)
  foodId: string;

  @property({
    type: 'string',
  })
  friendId?: string;

  constructor(data?: Partial<FoodIntolerance>) {
    super(data);
  }
}

export interface FoodIntoleranceRelations {
  // describe navigational properties here
}

export type FoodIntoleranceWithRelations = FoodIntolerance & FoodIntoleranceRelations;
