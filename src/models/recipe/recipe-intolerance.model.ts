import {Entity, model, property} from '@loopback/repository';

@model()
export class RecipeIntolerance extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<RecipeIntolerance>) {
    super(data);
  }
}

export interface RecipeIntoleranceRelations {
  // describe navigational properties here
}

export type RecipeIntoleranceWithRelations = RecipeIntolerance & RecipeIntoleranceRelations;
