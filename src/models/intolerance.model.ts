import {Entity, model, property} from '@loopback/repository';

@model()
export class Intolerance extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'boolean',
    default: false,
  })
  validate?: boolean;

  @property({
    type: 'date',
  })
  createAt?: string;

  @property({
    type: 'string',
  })
  recipeId?: string;

  constructor(data?: Partial<Intolerance>) {
    super(data);
  }
}

export interface IntoleranceRelations {
  // describe navigational properties here
}

export type IntoleranceWithRelations = Intolerance & IntoleranceRelations;
