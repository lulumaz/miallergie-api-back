import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Friend, FriendRelations, FriendAllergy, FriendDiet, FoodIntolerance} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FriendAllergyRepository} from './friend-allergy.repository';
import {FriendDietRepository} from './friend-diet.repository';
import {FoodIntoleranceRepository} from './food-intolerance.repository';

export class FriendRepository extends DefaultCrudRepository<
  Friend,
  typeof Friend.prototype.id,
  FriendRelations
> {

  public readonly allergies: HasManyRepositoryFactory<FriendAllergy, typeof Friend.prototype.id>;

  public readonly diets: HasManyRepositoryFactory<FriendDiet, typeof Friend.prototype.id>;

  public readonly intolerances: HasManyRepositoryFactory<FoodIntolerance, typeof Friend.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('FriendAllergyRepository') protected friendAllergyRepositoryGetter: Getter<FriendAllergyRepository>, @repository.getter('FriendDietRepository') protected friendDietRepositoryGetter: Getter<FriendDietRepository>, @repository.getter('FoodIntoleranceRepository') protected foodIntoleranceRepositoryGetter: Getter<FoodIntoleranceRepository>,
  ) {
    super(Friend, dataSource);
    this.intolerances = this.createHasManyRepositoryFactoryFor('intolerances', foodIntoleranceRepositoryGetter,);
    this.registerInclusionResolver('intolerances', this.intolerances.inclusionResolver);
    this.diets = this.createHasManyRepositoryFactoryFor('diets', friendDietRepositoryGetter,);
    this.registerInclusionResolver('diets', this.diets.inclusionResolver);
    this.allergies = this.createHasManyRepositoryFactoryFor('allergies', friendAllergyRepositoryGetter,);
    this.registerInclusionResolver('allergies', this.allergies.inclusionResolver);
  }
}
