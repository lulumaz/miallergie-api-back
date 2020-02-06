import {Allergy} from './allergy.model';
import {Recipe} from './recipe.model';
import {Entity, model, property, belongsTo} from '@loopback/repository';

@model()
export class RecipeAllergy extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Recipe)
  recipeId: string;

  @belongsTo(() => Allergy)
  allergyId: string;

  constructor(data?: Partial<RecipeAllergy>) {
    super(data);
  }
}

export interface RecipeAllergyRelations {
  // describe navigational properties here
}

export type RecipeAllergyWithRelations = RecipeAllergy & RecipeAllergyRelations;
