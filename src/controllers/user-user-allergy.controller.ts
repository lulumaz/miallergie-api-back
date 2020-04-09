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
  UserAllergy,
} from '../models';
import {UserRepository} from '../repositories';

export class UserUserAllergyController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/user-allergies', {
    responses: {
      '200': {
        description: 'Array of User has many UserAllergy',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserAllergy)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserAllergy>,
  ): Promise<UserAllergy[]> {
    return this.userRepository.allergies(id).find(filter);
  }

  @post('/users/{id}/user-allergies', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserAllergy)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserAllergy, {
            title: 'NewUserAllergyInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userAllergy: Omit<UserAllergy, 'id'>,
  ): Promise<UserAllergy> {
    return this.userRepository.allergies(id).create(userAllergy);
  }

  @patch('/users/{id}/user-allergies', {
    responses: {
      '200': {
        description: 'User.UserAllergy PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserAllergy, {partial: true}),
        },
      },
    })
    userAllergy: Partial<UserAllergy>,
    @param.query.object('where', getWhereSchemaFor(UserAllergy)) where?: Where<UserAllergy>,
  ): Promise<Count> {
    return this.userRepository.allergies(id).patch(userAllergy, where);
  }

  @del('/users/{id}/user-allergies', {
    responses: {
      '200': {
        description: 'User.UserAllergy DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserAllergy)) where?: Where<UserAllergy>,
  ): Promise<Count> {
    return this.userRepository.allergies(id).delete(where);
  }
}
