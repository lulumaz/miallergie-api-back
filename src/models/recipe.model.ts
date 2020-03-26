import {Diet} from './diet.model';
import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
  hasOne,
} from '@loopback/repository';
import {RecipeAllergy} from './recipe-allergy.model';
import {RecipeIntolerance} from './recipe-intolerance.model';
import {Ingredient} from './ingredient.model';
import {File} from './file.model';
import {User} from './user.model';
import {RecipeDiet} from './recipe-diet.model';

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
    type: 'string',
    required: true,
  })
  type: string; //entré, plat, dessert

  @property({
    type: 'array',
    itemType: 'string',
  })
  stages?: string[];

  @property({
    type: 'number',
  })
  difficulty?: number;

  @property({
    type: 'number',
  })
  duration?: number;

  @property({
    type: 'number',
  })
  numberOfPeople?: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createAt: string;

  @hasMany(() => RecipeAllergy)
  recipeAllergies: RecipeAllergy[];

  @hasMany(() => RecipeIntolerance)
  recipeIntolerances: RecipeIntolerance[];

  @hasMany(() => Ingredient)
  ingredients: Ingredient[];

  @belongsTo(() => File)
  imageId?: string;

  @belongsTo(() => User)
  ownerUserId: string;

  @hasMany(() => RecipeDiet)
  diets: RecipeDiet[];

  constructor(data?: Partial<Recipe>) {
    super(data);
  }
}

export interface RecipeRelations {
  // describe navigational properties here
  //link with ingredient thanks recipe-ingrdients
}

export type RecipeWithRelations = Recipe & RecipeRelations;
