import {Entity, model, property} from '@loopback/repository';

@model()
export class Allergy extends Entity {
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

  constructor(data?: Partial<Allergy>) {
    super(data);
  }
}

export interface AllergyRelations {
  // describe navigational properties here
}

export type AllergyWithRelations = Allergy & AllergyRelations;
