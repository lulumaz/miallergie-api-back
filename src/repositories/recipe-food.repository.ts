import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RecipeFood, RecipeFoodRelations} from '../models/recipe-food.model';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {Food} from '../models';
import {FoodRepository} from './food.repository';

export class RecipeFoodRepository extends DefaultCrudRepository<
  RecipeFood,
  typeof RecipeFood.prototype.id,
  RecipeFoodRelations
> {

  public readonly food: BelongsToAccessor<Food, typeof RecipeFood.prototype.id>;

  constructor(@inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>,) {
    super(RecipeFood, dataSource);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
  }
}
