import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FriendDiet, FriendDietRelations, Diet} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DietRepository} from './diet.repository';

export class FriendDietRepository extends DefaultCrudRepository<
  FriendDiet,
  typeof FriendDiet.prototype.id,
  FriendDietRelations
> {

  public readonly diet: BelongsToAccessor<Diet, typeof FriendDiet.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('DietRepository') protected dietRepositoryGetter: Getter<DietRepository>,
  ) {
    super(FriendDiet, dataSource);
    this.diet = this.createBelongsToAccessorFor('diet', dietRepositoryGetter,);
    this.registerInclusionResolver('diet', this.diet.inclusionResolver);
  }
}
