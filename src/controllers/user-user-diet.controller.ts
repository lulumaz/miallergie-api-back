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
import {User, UserDiet} from '../models';
import {UserRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';

@authenticate('jwt')
export class UserUserDietController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{id}/user-diets', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of User has many UserDiet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserDiet)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserDiet>,
  ): Promise<UserDiet[]> {
    return this.userRepository
      .diets(id)
      .find(filter, {strictObjectIDCoercion: true});
  }

  @post('/users/{id}/user-diets', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserDiet)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDiet, {
            title: 'NewUserDietInUser',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    userDiet: Omit<UserDiet, 'id'>,
  ): Promise<UserDiet> {
    return this.userRepository.diets(id).create(userDiet);
  }

  @patch('/users/{id}/user-diets', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.UserDiet PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDiet, {partial: true}),
        },
      },
    })
    userDiet: Partial<UserDiet>,
    @param.query.object('where', getWhereSchemaFor(UserDiet))
    where?: Where<UserDiet>,
  ): Promise<Count> {
    return this.userRepository
      .diets(id)
      .patch(userDiet, where, {strictObjectIDCoercion: true});
  }

  @del('/users/{id}/user-diets', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.UserDiet DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserDiet))
    where?: Where<UserDiet>,
  ): Promise<Count> {
    return this.userRepository
      .diets(id)
      .delete(where, {strictObjectIDCoercion: true});
  }
}
