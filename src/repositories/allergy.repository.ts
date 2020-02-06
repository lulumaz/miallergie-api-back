import {DefaultCrudRepository} from '@loopback/repository';
import {Allergy, AllergyRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class AllergyRepository extends DefaultCrudRepository<
  Allergy,
  typeof Allergy.prototype.id,
  AllergyRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(Allergy, dataSource);
  }
}
