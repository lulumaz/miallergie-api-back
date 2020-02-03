import {Intolerance} from './intolerance.model';
import {Diet} from './diet.model';
import {Allergy} from './allergy.model';
import {Entity, model, property, hasMany} from '@loopback/repository';

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
    itemType: Allergy,
  })
  @hasMany(() => Allergy)
  allergies?: Allergy[];

  @property({
    type: 'array',
    itemType: Diet,
  })
  @hasMany(() => Diet)
  diets?: Diet[];

  @property({
    type: 'array',
    itemType: Intolerance,
  })
  @hasMany(() => Intolerance)
  intolerances?: Intolerance[];

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
