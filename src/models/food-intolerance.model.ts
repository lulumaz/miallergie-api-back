import {Entity, model, property} from '@loopback/repository';

@model()
export class FoodIntolerance extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<FoodIntolerance>) {
    super(data);
  }
}

export interface FoodIntoleranceRelations {
  // describe navigational properties here
}

export type FoodIntoleranceWithRelations = FoodIntolerance & FoodIntoleranceRelations;
