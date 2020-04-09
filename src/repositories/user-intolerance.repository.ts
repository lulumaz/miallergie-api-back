import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {UserIntolerance, UserIntoleranceRelations, Intolerance} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {IntoleranceRepository} from './intolerance.repository';

export class UserIntoleranceRepository extends DefaultCrudRepository<
  UserIntolerance,
  typeof UserIntolerance.prototype.id,
  UserIntoleranceRelations
> {

  public readonly intolerance: BelongsToAccessor<Intolerance, typeof UserIntolerance.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('IntoleranceRepository') protected intoleranceRepositoryGetter: Getter<IntoleranceRepository>,
  ) {
    super(UserIntolerance, dataSource);
    this.intolerance = this.createBelongsToAccessorFor('intolerance', intoleranceRepositoryGetter,);
    this.registerInclusionResolver('intolerance', this.intolerance.inclusionResolver);
  }
}
