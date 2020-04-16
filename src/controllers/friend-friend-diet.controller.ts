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
import {Friend, FriendDiet} from '../models';
import {FriendRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class FriendFriendDietController {
  constructor(
    @repository(FriendRepository) protected friendRepository: FriendRepository,
  ) {}

  @get('/friends/{id}/friend-diets', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Friend has many FriendDiet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FriendDiet)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<FriendDiet>,
  ): Promise<FriendDiet[]> {
    return this.friendRepository.diets(id).find(filter);
  }

  @post('/friends/{id}/friend-diets', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Friend model instance',
        content: {'application/json': {schema: getModelSchemaRef(FriendDiet)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Friend.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FriendDiet, {
            title: 'NewFriendDietInFriend',
            exclude: ['id'],
            optional: ['friendId'],
          }),
        },
      },
    })
    friendDiet: Omit<FriendDiet, 'id'>,
  ): Promise<FriendDiet> {
    return this.friendRepository.diets(id).create(friendDiet);
  }

  @patch('/friends/{id}/friend-diets', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Friend.FriendDiet PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FriendDiet, {partial: true}),
        },
      },
    })
    friendDiet: Partial<FriendDiet>,
    @param.query.object('where', getWhereSchemaFor(FriendDiet))
    where?: Where<FriendDiet>,
  ): Promise<Count> {
    return this.friendRepository.diets(id).patch(friendDiet, where);
  }

  @del('/friends/{id}/friend-diets', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Friend.FriendDiet DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(FriendDiet))
    where?: Where<FriendDiet>,
  ): Promise<Count> {
    return this.friendRepository.diets(id).delete(where);
  }
}
