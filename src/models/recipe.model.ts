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
    type: 'string',
    required: false,
  })
  id_diet: string;

  constructor(data?: Partial<Recipe>) {
    super(data);
  }
}

export interface RecipeRelations {
  // describe navigational properties here
  //link with ingredient thanks recipe-ingrdients
}

export type RecipeWithRelations = Recipe & RecipeRelations;
