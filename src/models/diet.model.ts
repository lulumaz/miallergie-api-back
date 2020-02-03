import {Entity, model, property} from '@loopback/repository';

@model()
export class Diet extends Entity {
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

  constructor(data?: Partial<Diet>) {
    super(data);
  }
}

export interface DietRelations {
  // describe navigational properties here
}

export type DietWithRelations = Diet & DietRelations;
