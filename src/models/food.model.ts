import {Entity, model, property} from '@loopback/repository';

@model()
export class Food extends Entity {
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
    itemType: 'object',
  })
  classes?: object[];

  constructor(data?: Partial<Food>) {
    super(data);
  }
}

export interface FoodRelations {
  // describe navigational properties here
}

export type FoodWithRelations = Food & FoodRelations;
