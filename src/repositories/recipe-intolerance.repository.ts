import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RecipeIntolerance, RecipeIntoleranceRelations, Intolerance} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {IntoleranceRepository} from './intolerance.repository';

export class RecipeIntoleranceRepository extends DefaultCrudRepository<
  RecipeIntolerance,
  typeof RecipeIntolerance.prototype.id,
  RecipeIntoleranceRelations
> {

  public readonly intolerance: BelongsToAccessor<Intolerance, typeof RecipeIntolerance.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('IntoleranceRepository') protected intoleranceRepositoryGetter: Getter<IntoleranceRepository>,
  ) {
    super(RecipeIntolerance, dataSource);
    this.intolerance = this.createBelongsToAccessorFor('intolerance', intoleranceRepositoryGetter,);
    this.registerInclusionResolver('intolerance', this.intolerance.inclusionResolver);
  }
}
