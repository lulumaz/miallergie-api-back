import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {UserAllergy, UserAllergyRelations, Allergy} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AllergyRepository} from './allergy.repository';

export class UserAllergyRepository extends DefaultCrudRepository<
  UserAllergy,
  typeof UserAllergy.prototype.id,
  UserAllergyRelations
> {

  public readonly allergy: BelongsToAccessor<Allergy, typeof UserAllergy.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('AllergyRepository') protected allergyRepositoryGetter: Getter<AllergyRepository>,
  ) {
    super(UserAllergy, dataSource);
    this.allergy = this.createBelongsToAccessorFor('allergy', allergyRepositoryGetter,);
    this.registerInclusionResolver('allergy', this.allergy.inclusionResolver);
  }
}
