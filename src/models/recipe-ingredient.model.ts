import {Model, model, property} from '@loopback/repository';

@model()
export class RecipeIngredient extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id_ingredient: string;

  @property({
    type: 'number',
    required: true,
    default: 1,
  })
  quantity: number;

  @property({
    type: 'string',
    required: true,
  })
  unite: string;

  constructor(data?: Partial<RecipeIngredient>) {
    super(data);
  }
}

export interface RecipeIngredientRelations {
  // describe navigational properties here
}

export type RecipeIngredientWithRelations = RecipeIngredient &
  RecipeIngredientRelations;
