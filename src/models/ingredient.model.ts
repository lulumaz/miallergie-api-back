import {Entity, model, property} from '@loopback/repository';

@model()
export class Ingredient extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'object',
  })
  parent?: object;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  ids_allergie?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  ids_diet?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  ids_intolerance?: string[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  classes?: object[];

  constructor(data?: Partial<Ingredient>) {
    super(data);
  }
}

export interface IngredientRelations {
  // describe navigational properties here
}

export type IngredientWithRelations = Ingredient & IngredientRelations;
