import {Entity, model, property, hasMany} from '@loopback/repository';
import {Allergy} from './allergy.model';
import {Diet} from './diet.model';
import {Intolerance} from './intolerance.model';
import {FoodDiet} from './food-diet.model';
import {FoodAllergy} from './food-allergy.model';
import {FoodIntolerance} from './food-intolerance.model';

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

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createAt: string;

  @hasMany(() => FoodDiet)
  foodDiets: FoodDiet[];

  @hasMany(() => FoodAllergy)
  foodAllergies: FoodAllergy[];

  @hasMany(() => FoodIntolerance)
  foodIntolerances: FoodIntolerance[];

  constructor(data?: Partial<Food>) {
    super(data);
  }
}

export interface FoodRelations {
  // describe navigational properties here
}

export type FoodWithRelations = Food & FoodRelations;
