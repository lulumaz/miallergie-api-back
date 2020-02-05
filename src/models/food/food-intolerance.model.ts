import {Intolerance} from './../intolerance.model';
import {Food} from './../food.model';
import {Entity, model, property, belongsTo} from '@loopback/repository';

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

  @belongsTo(() => Intolerance)
  intoleranceId: string;

  constructor(data?: Partial<FoodIntolerance>) {
    super(data);
  }
}

export interface FoodIntoleranceRelations {
  // describe navigational properties here
}

export type FoodIntoleranceWithRelations = FoodIntolerance &
  FoodIntoleranceRelations;
