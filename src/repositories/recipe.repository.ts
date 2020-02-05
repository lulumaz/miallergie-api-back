import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Recipe, RecipeRelations, Diet} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DietRepository} from './diet.repository';

export class RecipeRepository extends DefaultCrudRepository<
  Recipe,
  typeof Recipe.prototype.id,
  RecipeRelations
> {

  public readonly diet: BelongsToAccessor<Diet, typeof Recipe.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('DietRepository') protected dietRepositoryGetter: Getter<DietRepository>,
  ) {
    super(Recipe, dataSource);
    this.diet = this.createBelongsToAccessorFor('diet', dietRepositoryGetter,);
    this.registerInclusionResolver('diet', this.diet.inclusionResolver);
  }
}
