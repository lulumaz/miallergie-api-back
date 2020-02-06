import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Intolerance} from './intolerance.model';

@model()
export class RecipeIntolerance extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Intolerance)
  intoleranceId: string;

  @property({
    type: 'string',
  })
  recipeId?: string;

  constructor(data?: Partial<RecipeIntolerance>) {
    super(data);
  }
}

export interface RecipeIntoleranceRelations {
  // describe navigational properties here
}

export type RecipeIntoleranceWithRelations = RecipeIntolerance &
  RecipeIntoleranceRelations;
