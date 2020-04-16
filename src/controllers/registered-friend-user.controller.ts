import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {RegisteredFriend, User} from '../models';
import {RegisteredFriendRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class RegisteredFriendUserController {
  constructor(
    @repository(RegisteredFriendRepository)
    public registeredFriendRepository: RegisteredFriendRepository,
  ) {}

  @get('/registered-friends/{id}/user', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User belonging to RegisteredFriend',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof RegisteredFriend.prototype.id,
  ): Promise<User> {
    return this.registeredFriendRepository.user(id);
  }
}
