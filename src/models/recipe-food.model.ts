import {Food} from './food.model';
import {Recipe} from './recipe.model';
import {Entity, model, property, belongsTo} from '@loopback/repository';

@model()
export class RecipeFood extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Recipe)
  recipeId: string;

  @belongsTo(() => Food)
  foodId: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'string',
    required: true,
  })
  unit: string;

  constructor(data?: Partial<RecipeFood>) {
    super(data);
  }
}

export interface RecipeFoodRelations {
  // describe navigational properties here
}

export type RecipeFoodWithRelations = RecipeFood & RecipeFoodRelations;
