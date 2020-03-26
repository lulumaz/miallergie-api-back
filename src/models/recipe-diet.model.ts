import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Diet} from './diet.model';

@model()
export class RecipeDiet extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  recipeId?: string;

  @belongsTo(() => Diet)
  dietId: string;

  constructor(data?: Partial<RecipeDiet>) {
    super(data);
  }
}

export interface RecipeDietRelations {
  // describe navigational properties here
}

export type RecipeDietWithRelations = RecipeDiet & RecipeDietRelations;
