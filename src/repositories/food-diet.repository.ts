import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FoodDiet, FoodDietRelations, Food, Diet} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodRepository} from './food.repository';
import {DietRepository} from './diet.repository';

export class FoodDietRepository extends DefaultCrudRepository<
  FoodDiet,
  typeof FoodDiet.prototype.id,
  FoodDietRelations
> {

  public readonly food: BelongsToAccessor<Food, typeof FoodDiet.prototype.id>;

  public readonly diet: BelongsToAccessor<Diet, typeof FoodDiet.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>, @repository.getter('DietRepository') protected dietRepositoryGetter: Getter<DietRepository>,
  ) {
    super(FoodDiet, dataSource);
    this.diet = this.createBelongsToAccessorFor('diet', dietRepositoryGetter,);
    this.registerInclusionResolver('diet', this.diet.inclusionResolver);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
  }
}
