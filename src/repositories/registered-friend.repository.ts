import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {RegisteredFriend, RegisteredFriendRelations, User} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class RegisteredFriendRepository extends DefaultCrudRepository<
  RegisteredFriend,
  typeof RegisteredFriend.prototype.id,
  RegisteredFriendRelations
> {

  public readonly user: BelongsToAccessor<User, typeof RegisteredFriend.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(RegisteredFriend, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
