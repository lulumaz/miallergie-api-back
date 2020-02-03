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
    itemType: 'object',
  })
  allergies?: object[];

  @property({
    type: 'object',
    required: true,
  })
  diet: object;

  @property({
    type: 'array',
    itemType: 'object',
  })
  intolerances?: object[];


  constructor(data?: Partial<Recipe>) {
    super(data);
  }
}

export interface RecipeRelations {
  // describe navigational properties here
}

export type RecipeWithRelations = Recipe & RecipeRelations;
