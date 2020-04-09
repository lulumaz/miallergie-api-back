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
  Friend,
  FriendAllergy,
} from '../models';
import {FriendRepository} from '../repositories';

export class FriendFriendAllergyController {
  constructor(
    @repository(FriendRepository) protected friendRepository: FriendRepository,
  ) { }

  @get('/friends/{id}/friend-allergies', {
    responses: {
      '200': {
        description: 'Array of Friend has many FriendAllergy',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FriendAllergy)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<FriendAllergy>,
  ): Promise<FriendAllergy[]> {
    return this.friendRepository.allergies(id).find(filter);
  }

  @post('/friends/{id}/friend-allergies', {
    responses: {
      '200': {
        description: 'Friend model instance',
        content: {'application/json': {schema: getModelSchemaRef(FriendAllergy)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Friend.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FriendAllergy, {
            title: 'NewFriendAllergyInFriend',
            exclude: ['id'],
            optional: ['friendId']
          }),
        },
      },
    }) friendAllergy: Omit<FriendAllergy, 'id'>,
  ): Promise<FriendAllergy> {
    return this.friendRepository.allergies(id).create(friendAllergy);
  }

  @patch('/friends/{id}/friend-allergies', {
    responses: {
      '200': {
        description: 'Friend.FriendAllergy PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FriendAllergy, {partial: true}),
        },
      },
    })
    friendAllergy: Partial<FriendAllergy>,
    @param.query.object('where', getWhereSchemaFor(FriendAllergy)) where?: Where<FriendAllergy>,
  ): Promise<Count> {
    return this.friendRepository.allergies(id).patch(friendAllergy, where);
  }

  @del('/friends/{id}/friend-allergies', {
    responses: {
      '200': {
        description: 'Friend.FriendAllergy DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(FriendAllergy)) where?: Where<FriendAllergy>,
  ): Promise<Count> {
    return this.friendRepository.allergies(id).delete(where);
  }
}
