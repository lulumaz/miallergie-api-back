import {Entity, model, property} from '@loopback/repository';

@model()
export class Unit extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  value: string;


  constructor(data?: Partial<Unit>) {
    super(data);
  }
}

export interface UnitRelations {
  // describe navigational properties here
}

export type UnitWithRelations = Unit & UnitRelations;
