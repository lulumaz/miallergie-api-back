import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FoodIntolerance, FoodIntoleranceRelations, Food, Intolerance} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodRepository} from './food.repository';
import {IntoleranceRepository} from './intolerance.repository';

export class FoodIntoleranceRepository extends DefaultCrudRepository<
  FoodIntolerance,
  typeof FoodIntolerance.prototype.id,
  FoodIntoleranceRelations
> {

  public readonly food: BelongsToAccessor<Food, typeof FoodIntolerance.prototype.id>;

  public readonly intolerance: BelongsToAccessor<Intolerance, typeof FoodIntolerance.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>, @repository.getter('IntoleranceRepository') protected intoleranceRepositoryGetter: Getter<IntoleranceRepository>,
  ) {
    super(FoodIntolerance, dataSource);
    this.intolerance = this.createBelongsToAccessorFor('intolerance', intoleranceRepositoryGetter,);
    this.registerInclusionResolver('intolerance', this.intolerance.inclusionResolver);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
  }
}
