import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FoodAllergy, FoodAllergyRelations, Food} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodRepository} from './food.repository';

export class FoodAllergyRepository extends DefaultCrudRepository<
  FoodAllergy,
  typeof FoodAllergy.prototype.id,
  FoodAllergyRelations
> {

  public readonly food: BelongsToAccessor<Food, typeof FoodAllergy.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>,
  ) {
    super(FoodAllergy, dataSource);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
  }
}
