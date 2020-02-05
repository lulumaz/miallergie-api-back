import {Diet} from './../diet.model';
import {Intolerance} from './../intolerance.model';
import {Allergy} from './../allergy.model';
import {InputRecipe} from './../input/input-recipe.model';
import {Model, model, property} from '@loopback/repository';

@model()
export class OutputRecipe extends InputRecipe {
  @property({
    type: 'array',
    itemType: Allergy,
  })
  allergies?: Allergy[];

  @property({
    type: 'array',
    itemType: Intolerance,
  })
  intolerances?: Intolerance[];

  constructor(data?: Partial<OutputRecipe>) {
    super(data);
  }
}

export interface OutputRecipeRelations {
  // describe navigational properties here
}

export type OutputRecipeWithRelations = OutputRecipe & OutputRecipeRelations;
