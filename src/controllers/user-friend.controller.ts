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
import {
  User,
  Friend,
} from '../models';
import {UserRepository} from '../repositories';

export class UserFriendController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/friends', {
    responses: {
      '200': {
        description: 'Array of User has many Friend',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Friend)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Friend>,
  ): Promise<Friend[]> {
    return this.userRepository.nonRegisteredFriends(id).find(filter);
  }

  @post('/users/{id}/friends', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Friend)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Friend, {
            title: 'NewFriendInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) friend: Omit<Friend, 'id'>,
  ): Promise<Friend> {
    return this.userRepository.nonRegisteredFriends(id).create(friend);
  }

  @patch('/users/{id}/friends', {
    responses: {
      '200': {
        description: 'User.Friend PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Friend, {partial: true}),
        },
      },
    })
    friend: Partial<Friend>,
    @param.query.object('where', getWhereSchemaFor(Friend)) where?: Where<Friend>,
  ): Promise<Count> {
    return this.userRepository.nonRegisteredFriends(id).patch(friend, where);
  }

  @del('/users/{id}/friends', {
    responses: {
      '200': {
        description: 'User.Friend DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Friend)) where?: Where<Friend>,
  ): Promise<Count> {
    return this.userRepository.nonRegisteredFriends(id).delete(where);
  }
}
