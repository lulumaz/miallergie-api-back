import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RecipeDiet, RecipeDietRelations, Diet} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DietRepository} from './diet.repository';

export class RecipeDietRepository extends DefaultCrudRepository<
  RecipeDiet,
  typeof RecipeDiet.prototype.id,
  RecipeDietRelations
> {

  public readonly diet: BelongsToAccessor<Diet, typeof RecipeDiet.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('DietRepository') protected dietRepositoryGetter: Getter<DietRepository>,
  ) {
    super(RecipeDiet, dataSource);
    this.diet = this.createBelongsToAccessorFor('diet', dietRepositoryGetter,);
    this.registerInclusionResolver('diet', this.diet.inclusionResolver);
  }
}
