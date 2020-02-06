import {DefaultCrudRepository} from '@loopback/repository';
import {RecipeIntolerance, RecipeIntoleranceRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RecipeIntoleranceRepository extends DefaultCrudRepository<
  RecipeIntolerance,
  typeof RecipeIntolerance.prototype.id,
  RecipeIntoleranceRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(RecipeIntolerance, dataSource);
  }
}
