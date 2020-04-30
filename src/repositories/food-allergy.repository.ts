import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FoodAllergy, FoodAllergyRelations, Food, Allergy} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodRepository} from './food.repository';
import {AllergyRepository} from './allergy.repository';

export class FoodAllergyRepository extends DefaultCrudRepository<
  FoodAllergy,
  typeof FoodAllergy.prototype.id,
  FoodAllergyRelations
> {

  public readonly food: BelongsToAccessor<Food, typeof FoodAllergy.prototype.id>;

  public readonly allergy: BelongsToAccessor<Allergy, typeof FoodAllergy.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>, @repository.getter('AllergyRepository') protected allergyRepositoryGetter: Getter<AllergyRepository>,
  ) {
    super(FoodAllergy, dataSource);
    this.allergy = this.createBelongsToAccessorFor('allergy', allergyRepositoryGetter,);
    this.registerInclusionResolver('allergy', this.allergy.inclusionResolver);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
  }
}
