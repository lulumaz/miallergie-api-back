import {Entity, model, property} from '@loopback/repository';

@model()
export class RecipeAllergy extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  constructor(data?: Partial<RecipeAllergy>) {
    super(data);
  }
}

export interface RecipeAllergyRelations {
  // describe navigational properties here
}

export type RecipeAllergyWithRelations = RecipeAllergy & RecipeAllergyRelations;
