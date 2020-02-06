import {DefaultCrudRepository} from '@loopback/repository';
import {Diet, DietRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DietRepository extends DefaultCrudRepository<
  Diet,
  typeof Diet.prototype.id,
  DietRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(Diet, dataSource);
  }
}
