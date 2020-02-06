import {Intolerance} from './intolerance.model';
import {Recipe} from './recipe.model';
import {Entity, model, property, belongsTo} from '@loopback/repository';

@model()
export class RecipeIntolerance extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Recipe)
  recipeId: string;

  @belongsTo(() => Intolerance)
  intoleranceId: string;

  constructor(data?: Partial<RecipeIntolerance>) {
    super(data);
  }
}

export interface RecipeIntoleranceRelations {
  // describe navigational properties here
}

export type RecipeIntoleranceWithRelations = RecipeIntolerance &
  RecipeIntoleranceRelations;
