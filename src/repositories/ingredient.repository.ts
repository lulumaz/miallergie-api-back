import {DefaultCrudRepository} from '@loopback/repository';
import {Ingredient, IngredientRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class IngredientRepository extends DefaultCrudRepository<
  Ingredient,
  typeof Ingredient.prototype.id,
  IngredientRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(Ingredient, dataSource);
  }
}
