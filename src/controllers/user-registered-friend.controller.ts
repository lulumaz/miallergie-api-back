import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {User, RegisteredFriend} from '../models';
import {UserRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';

@authenticate('jwt')
export class UserRegisteredFriendController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{id}/registered-friends', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of User has many RegisteredFriend',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RegisteredFriend)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<RegisteredFriend>,
  ): Promise<RegisteredFriend[]> {
    return this.userRepository.registeredFriends(id).find(filter);
  }

  @post('/users/{id}/registered-friends', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(RegisteredFriend)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegisteredFriend, {
            title: 'NewRegisteredFriendInUser',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    registeredFriend: Omit<RegisteredFriend, 'id'>,
  ): Promise<RegisteredFriend> {
    return this.userRepository.registeredFriends(id).create(registeredFriend);
  }

  @patch('/users/{id}/registered-friends', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.RegisteredFriend PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegisteredFriend, {partial: true}),
        },
      },
    })
    registeredFriend: Partial<RegisteredFriend>,
    @param.query.object('where', getWhereSchemaFor(RegisteredFriend))
    where?: Where<RegisteredFriend>,
  ): Promise<Count> {
    return this.userRepository
      .registeredFriends(id)
      .patch(registeredFriend, where);
  }

  @del('/users/{id}/registered-friends', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.RegisteredFriend DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(RegisteredFriend))
    where?: Where<RegisteredFriend>,
  ): Promise<Count> {
    return this.userRepository.registeredFriends(id).delete(where);
  }
}
