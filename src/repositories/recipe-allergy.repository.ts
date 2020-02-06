import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RecipeAllergy, RecipeAllergyRelations, Allergy} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AllergyRepository} from './allergy.repository';

export class RecipeAllergyRepository extends DefaultCrudRepository<
  RecipeAllergy,
  typeof RecipeAllergy.prototype.id,
  RecipeAllergyRelations
> {

  public readonly allergy: BelongsToAccessor<Allergy, typeof RecipeAllergy.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('AllergyRepository') protected allergyRepositoryGetter: Getter<AllergyRepository>,
  ) {
    super(RecipeAllergy, dataSource);
    this.allergy = this.createBelongsToAccessorFor('allergy', allergyRepositoryGetter,);
    this.registerInclusionResolver('allergy', this.allergy.inclusionResolver);
  }
}
