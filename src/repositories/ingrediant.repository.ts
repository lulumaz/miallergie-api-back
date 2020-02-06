import {DefaultCrudRepository} from '@loopback/repository';
import {Ingrediant, IngrediantRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class IngrediantRepository extends DefaultCrudRepository<
  Ingrediant,
  typeof Ingrediant.prototype.id,
  IngrediantRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(Ingrediant, dataSource);
  }
}
