import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Food, FoodRelations, Allergy, Diet, Intolerance} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AllergyRepository} from './allergy.repository';
import {DietRepository} from './diet.repository';
import {IntoleranceRepository} from './intolerance.repository';

export class FoodRepository extends DefaultCrudRepository<
  Food,
  typeof Food.prototype.id,
  FoodRelations
> {

  public readonly allergies: HasManyRepositoryFactory<Allergy, typeof Food.prototype.id>;

  public readonly diets: HasManyRepositoryFactory<Diet, typeof Food.prototype.id>;

  public readonly intolerances: HasManyRepositoryFactory<Intolerance, typeof Food.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('AllergyRepository') protected allergyRepositoryGetter: Getter<AllergyRepository>, @repository.getter('DietRepository') protected dietRepositoryGetter: Getter<DietRepository>, @repository.getter('IntoleranceRepository') protected intoleranceRepositoryGetter: Getter<IntoleranceRepository>,
  ) {
    super(Food, dataSource);
    this.intolerances = this.createHasManyRepositoryFactoryFor('intolerances', intoleranceRepositoryGetter,);
    this.registerInclusionResolver('intolerances', this.intolerances.inclusionResolver);
    this.diets = this.createHasManyRepositoryFactoryFor('diets', dietRepositoryGetter,);
    this.registerInclusionResolver('diets', this.diets.inclusionResolver);
    this.allergies = this.createHasManyRepositoryFactoryFor('allergies', allergyRepositoryGetter,);
    this.registerInclusionResolver('allergies', this.allergies.inclusionResolver);
  }
}
