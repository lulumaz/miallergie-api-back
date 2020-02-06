import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FoodIntolerance, FoodIntoleranceRelations, Food} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodRepository} from './food.repository';

export class FoodIntoleranceRepository extends DefaultCrudRepository<
  FoodIntolerance,
  typeof FoodIntolerance.prototype.id,
  FoodIntoleranceRelations
> {

  public readonly food: BelongsToAccessor<Food, typeof FoodIntolerance.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>,
  ) {
    super(FoodIntolerance, dataSource);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
  }
}
