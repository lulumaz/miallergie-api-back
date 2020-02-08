import {Diet} from './diet.model';
import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
} from '@loopback/repository';
import {RecipeAllergy} from './recipe-allergy.model';
import {RecipeIntolerance} from './recipe-intolerance.model';
import {Ingredient} from './ingredient.model';

@model()
export class Recipe extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  stages?: string[];

  @property({
    type: 'number',
  })
  difficulty?: number;

  @property({
    type: 'number',
  })
  duration?: number;

  @property({
    type: 'number',
  })
  numberOfPeople?: number;

  @belongsTo(() => Diet)
  dietId: string;

  @hasMany(() => RecipeAllergy)
  recipeAllergies: RecipeAllergy[];

  @hasMany(() => RecipeIntolerance)
  recipeIntolerances: RecipeIntolerance[];

  @hasMany(() => Ingredient)
  ingredients: Ingredient[];

  constructor(data?: Partial<Recipe>) {
    super(data);
  }
}

export interface RecipeRelations {
  // describe navigational properties here
  //link with ingredient thanks recipe-ingrdients
}

export type RecipeWithRelations = Recipe & RecipeRelations;
