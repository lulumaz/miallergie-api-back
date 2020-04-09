import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FriendIntolerance, FriendIntoleranceRelations, Intolerance} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {IntoleranceRepository} from './intolerance.repository';

export class FriendIntoleranceRepository extends DefaultCrudRepository<
  FriendIntolerance,
  typeof FriendIntolerance.prototype.id,
  FriendIntoleranceRelations
> {

  public readonly intolerance: BelongsToAccessor<Intolerance, typeof FriendIntolerance.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('IntoleranceRepository') protected intoleranceRepositoryGetter: Getter<IntoleranceRepository>,
  ) {
    super(FriendIntolerance, dataSource);
    this.intolerance = this.createBelongsToAccessorFor('intolerance', intoleranceRepositoryGetter,);
    this.registerInclusionResolver('intolerance', this.intolerance.inclusionResolver);
  }
}
