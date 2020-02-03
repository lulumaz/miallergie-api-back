import {DefaultCrudRepository} from '@loopback/repository';
import {Intolerance, IntoleranceRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class IntoleranceRepository extends DefaultCrudRepository<
  Intolerance,
  typeof Intolerance.prototype.id,
  IntoleranceRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(Intolerance, dataSource);
  }
}
