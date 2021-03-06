import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Food} from './food.model';
import {Unit} from './unit.model';

@model()
export class Ingredient extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'string',
  })
  recipeId?: string;

  @belongsTo(() => Food)
  foodId: string;

  @belongsTo(() => Unit, {name: 'unitRelation'})
  unit: string;

  constructor(data?: Partial<Ingredient>) {
    super(data);
  }
}

export interface IngredientRelations {
  // describe navigational properties here
}

export type IngredientWithRelations = Ingredient & IngredientRelations;
