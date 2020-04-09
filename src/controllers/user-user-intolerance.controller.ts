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
  UserIntolerance,
} from '../models';
import {UserRepository} from '../repositories';

export class UserUserIntoleranceController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/user-intolerances', {
    responses: {
      '200': {
        description: 'Array of User has many UserIntolerance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserIntolerance)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserIntolerance>,
  ): Promise<UserIntolerance[]> {
    return this.userRepository.intolerances(id).find(filter);
  }

  @post('/users/{id}/user-intolerances', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserIntolerance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserIntolerance, {
            title: 'NewUserIntoleranceInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userIntolerance: Omit<UserIntolerance, 'id'>,
  ): Promise<UserIntolerance> {
    return this.userRepository.intolerances(id).create(userIntolerance);
  }

  @patch('/users/{id}/user-intolerances', {
    responses: {
      '200': {
        description: 'User.UserIntolerance PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserIntolerance, {partial: true}),
        },
      },
    })
    userIntolerance: Partial<UserIntolerance>,
    @param.query.object('where', getWhereSchemaFor(UserIntolerance)) where?: Where<UserIntolerance>,
  ): Promise<Count> {
    return this.userRepository.intolerances(id).patch(userIntolerance, where);
  }

  @del('/users/{id}/user-intolerances', {
    responses: {
      '200': {
        description: 'User.UserIntolerance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserIntolerance)) where?: Where<UserIntolerance>,
  ): Promise<Count> {
    return this.userRepository.intolerances(id).delete(where);
  }
}
