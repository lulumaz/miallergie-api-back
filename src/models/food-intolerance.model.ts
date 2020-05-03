import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Food} from './food.model';
import {Intolerance} from './intolerance.model';

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

  @belongsTo(() => Intolerance)
  intoleranceId: string;

  constructor(data?: Partial<FoodIntolerance>) {
    super(data);
  }
}

export interface FoodIntoleranceRelations {
  // describe navigational properties here
  intolerance?: Intolerance;
}

export type FoodIntoleranceWithRelations = FoodIntolerance &
  FoodIntoleranceRelations;
