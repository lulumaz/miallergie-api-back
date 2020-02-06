import {DefaultCrudRepository} from '@loopback/repository';
import {FoodAllergy, FoodAllergyRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class FoodAllergyRepository extends DefaultCrudRepository<
  FoodAllergy,
  typeof FoodAllergy.prototype.id,
  FoodAllergyRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(FoodAllergy, dataSource);
  }
}
