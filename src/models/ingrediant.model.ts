import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Food} from './food.model';

@model()
export class Ingrediant extends Entity {
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
    required: true,
  })
  unit: string;

  @belongsTo(() => Food)
  foodId: string;

  constructor(data?: Partial<Ingrediant>) {
    super(data);
  }
}

export interface IngrediantRelations {
  // describe navigational properties here
}

export type IngrediantWithRelations = Ingrediant & IngrediantRelations;
