import {DefaultCrudRepository} from '@loopback/repository';
import {RecipeFood, RecipeFoodRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RecipeFoodRepository extends DefaultCrudRepository<
  RecipeFood,
  typeof RecipeFood.prototype.id,
  RecipeFoodRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(RecipeFood, dataSource);
  }
}
