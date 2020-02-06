import {DefaultCrudRepository} from '@loopback/repository';
import {FoodIntolerance, FoodIntoleranceRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class FoodIntoleranceRepository extends DefaultCrudRepository<
  FoodIntolerance,
  typeof FoodIntolerance.prototype.id,
  FoodIntoleranceRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(FoodIntolerance, dataSource);
  }
}
