import {DefaultCrudRepository} from '@loopback/repository';
import {Unit, UnitRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UnitRepository extends DefaultCrudRepository<
  Unit,
  typeof Unit.prototype.value,
  UnitRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(Unit, dataSource);
  }
}
