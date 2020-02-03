import {Intolerance} from './intolerance.model';
import {Diet} from './diet.model';
import {Allergy} from './allergy.model';
import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';

@model()
export class Recipe extends Entity {
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
    type: 'array',
    itemType: Allergy,
  })
  @hasMany(() => Allergy)
  allergies?: Allergy[];

  @property({
    type: 'array',
    itemType: Intolerance,
  })
  @hasMany(() => Intolerance)
  intolerances?: Intolerance[];

  @property({
    type: Diet,
    required: false,
  })
  @hasOne(() => Diet)
  diet: Diet;

  constructor(data?: Partial<Recipe>) {
    super(data);
  }
}

export interface RecipeRelations {
  // describe navigational properties here
}

export type RecipeWithRelations = Recipe & RecipeRelations;
