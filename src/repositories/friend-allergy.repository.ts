import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FriendAllergy, FriendAllergyRelations, Allergy} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AllergyRepository} from './allergy.repository';

export class FriendAllergyRepository extends DefaultCrudRepository<
  FriendAllergy,
  typeof FriendAllergy.prototype.id,
  FriendAllergyRelations
> {

  public readonly allergy: BelongsToAccessor<Allergy, typeof FriendAllergy.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('AllergyRepository') protected allergyRepositoryGetter: Getter<AllergyRepository>,
  ) {
    super(FriendAllergy, dataSource);
    this.allergy = this.createBelongsToAccessorFor('allergy', allergyRepositoryGetter,);
    this.registerInclusionResolver('allergy', this.allergy.inclusionResolver);
  }
}
