import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Allergy} from './allergy.model';

@model()
export class RecipeAllergy extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Allergy)
  allergyId: string;

  @property({
    type: 'string',
  })
  recipeId?: string;

  constructor(data?: Partial<RecipeAllergy>) {
    super(data);
  }
}

export interface RecipeAllergyRelations {
  // describe navigational properties here
}

export type RecipeAllergyWithRelations = RecipeAllergy & RecipeAllergyRelations;
