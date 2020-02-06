import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FoodDiet, FoodDietRelations, Food} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodRepository} from './food.repository';

export class FoodDietRepository extends DefaultCrudRepository<
  FoodDiet,
  typeof FoodDiet.prototype.id,
  FoodDietRelations
> {

  public readonly food: BelongsToAccessor<Food, typeof FoodDiet.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>,
  ) {
    super(FoodDiet, dataSource);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
  }
}
