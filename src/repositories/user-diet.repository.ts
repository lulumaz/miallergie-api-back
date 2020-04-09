import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {UserDiet, UserDietRelations, Diet} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DietRepository} from './diet.repository';

export class UserDietRepository extends DefaultCrudRepository<
  UserDiet,
  typeof UserDiet.prototype.id,
  UserDietRelations
> {

  public readonly diet: BelongsToAccessor<Diet, typeof UserDiet.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('DietRepository') protected dietRepositoryGetter: Getter<DietRepository>,
  ) {
    super(UserDiet, dataSource);
    this.diet = this.createBelongsToAccessorFor('diet', dietRepositoryGetter,);
    this.registerInclusionResolver('diet', this.diet.inclusionResolver);
  }
}
