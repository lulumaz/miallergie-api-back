import {DefaultCrudRepository} from '@loopback/repository';
import {RegisteredFriend, RegisteredFriendRelations} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RegisteredFriendRepository extends DefaultCrudRepository<
  RegisteredFriend,
  typeof RegisteredFriend.prototype.id,
  RegisteredFriendRelations
> {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(RegisteredFriend, dataSource);
  }
}
