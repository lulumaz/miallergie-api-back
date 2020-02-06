import {DefaultCrudRepository} from '@loopback/repository';
import {RecipeAllergy, RecipeAllergyRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RecipeAllergyRepository extends DefaultCrudRepository<
  RecipeAllergy,
  typeof RecipeAllergy.prototype.id,
  RecipeAllergyRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(RecipeAllergy, dataSource);
  }
}
