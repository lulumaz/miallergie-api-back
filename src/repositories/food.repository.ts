import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Food, FoodRelations, FoodDiet, FoodAllergy, FoodIntolerance} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodDietRepository} from './food-diet.repository';
import {FoodAllergyRepository} from './food-allergy.repository';
import {FoodIntoleranceRepository} from './food-intolerance.repository';

export class FoodRepository extends DefaultCrudRepository<
  Food,
  typeof Food.prototype.id,
  FoodRelations
> {

  public readonly foodDiets: HasManyRepositoryFactory<FoodDiet, typeof Food.prototype.id>;

  public readonly foodAllergies: HasManyRepositoryFactory<FoodAllergy, typeof Food.prototype.id>;

  public readonly foodIntolerances: HasManyRepositoryFactory<FoodIntolerance, typeof Food.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('FoodDietRepository') protected foodDietRepositoryGetter: Getter<FoodDietRepository>, @repository.getter('FoodAllergyRepository') protected foodAllergyRepositoryGetter: Getter<FoodAllergyRepository>, @repository.getter('FoodIntoleranceRepository') protected foodIntoleranceRepositoryGetter: Getter<FoodIntoleranceRepository>,
  ) {
    super(Food, dataSource);
    this.foodIntolerances = this.createHasManyRepositoryFactoryFor('foodIntolerances', foodIntoleranceRepositoryGetter,);
    this.registerInclusionResolver('foodIntolerances', this.foodIntolerances.inclusionResolver);
    this.foodAllergies = this.createHasManyRepositoryFactoryFor('foodAllergies', foodAllergyRepositoryGetter,);
    this.registerInclusionResolver('foodAllergies', this.foodAllergies.inclusionResolver);
    this.foodDiets = this.createHasManyRepositoryFactoryFor('foodDiets', foodDietRepositoryGetter,);
    this.registerInclusionResolver('foodDiets', this.foodDiets.inclusionResolver);
  }
}
