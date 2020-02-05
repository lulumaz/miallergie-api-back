import {Entity, model, property} from '@loopback/repository';

@model()
export class RecipeFood extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<RecipeFood>) {
    super(data);
  }
}

export interface RecipeFoodRelations {
  // describe navigational properties here
}

export type RecipeFoodWithRelations = RecipeFood & RecipeFoodRelations;
