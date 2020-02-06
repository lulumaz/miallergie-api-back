import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Ingrediant, IngrediantRelations, Food} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodRepository} from './food.repository';

export class IngrediantRepository extends DefaultCrudRepository<
  Ingrediant,
  typeof Ingrediant.prototype.id,
  IngrediantRelations
> {

  public readonly food: BelongsToAccessor<Food, typeof Ingrediant.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>,
  ) {
    super(Ingrediant, dataSource);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
  }
}
