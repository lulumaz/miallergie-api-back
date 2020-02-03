import {RecipeIngredient} from './recipe-ingredient.model';
import {Entity, model, property} from '@loopback/repository';

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
  ids_allergie?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  ids_intolerance?: string[];

  @property({
    type: 'string',
    required: false,
  })
  id_diet: string;

  @property({
    type: 'array',
    itemType: RecipeIngredient,
  })
  ingredients: RecipeIngredient[];

  constructor(data?: Partial<Recipe>) {
    super(data);
  }
}

export interface RecipeRelations {
  // describe navigational properties here
}

export type RecipeWithRelations = Recipe & RecipeRelations;
