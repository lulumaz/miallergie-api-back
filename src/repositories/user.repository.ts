import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {User, UserRelations, UserAllergy, UserDiet, UserIntolerance} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserAllergyRepository} from './user-allergy.repository';
import {UserDietRepository} from './user-diet.repository';
import {UserIntoleranceRepository} from './user-intolerance.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly allergies: HasManyRepositoryFactory<
    UserAllergy,
    typeof User.prototype.id
  >;

  public readonly diets: HasManyRepositoryFactory<UserDiet, typeof User.prototype.id>;

  public readonly intolerances: HasManyRepositoryFactory<UserIntolerance, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
    @repository.getter('UserAllergyRepository')
    protected userAllergyRepositoryGetter: Getter<UserAllergyRepository>, @repository.getter('UserDietRepository') protected userDietRepositoryGetter: Getter<UserDietRepository>, @repository.getter('UserIntoleranceRepository') protected userIntoleranceRepositoryGetter: Getter<UserIntoleranceRepository>,
  ) {
    super(User, dataSource);
    this.intolerances = this.createHasManyRepositoryFactoryFor('intolerances', userIntoleranceRepositoryGetter,);
    this.registerInclusionResolver('intolerances', this.intolerances.inclusionResolver);
    this.diets = this.createHasManyRepositoryFactoryFor('diets', userDietRepositoryGetter,);
    this.registerInclusionResolver('diets', this.diets.inclusionResolver);
    this.allergies = this.createHasManyRepositoryFactoryFor(
      'allergies',
      userAllergyRepositoryGetter,
    );
    this.registerInclusionResolver(
      'allergies',
      this.allergies.inclusionResolver,
    );
  }
}
