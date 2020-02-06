import {DefaultCrudRepository} from '@loopback/repository';
import {FoodDiet, FoodDietRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class FoodDietRepository extends DefaultCrudRepository<
  FoodDiet,
  typeof FoodDiet.prototype.id,
  FoodDietRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(FoodDiet, dataSource);
  }
}
