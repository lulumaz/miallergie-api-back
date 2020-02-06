import {RecipeFood} from '../recipe-food.model';
import {Recipe} from './../recipe.model';
import {model, property} from '@loopback/repository';

@model()
export class InputRecipe extends Recipe {
  @property({
    type: 'array',
    itemType: RecipeFood,
  })
  ingrediants: RecipeFood[];

  constructor(data?: Partial<InputRecipe>) {
    super(data);
  }
}

export interface InputRecipeRelations {
  // describe navigational properties here
}

export type InputRecipeWithRelations = InputRecipe & InputRecipeRelations;
