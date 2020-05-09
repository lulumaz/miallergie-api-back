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
import {Friend, FriendIntolerance} from '../models';
import {FriendRepository} from '../repositories';

export class FriendFriendIntoleranceController {
  constructor(
    @repository(FriendRepository) protected friendRepository: FriendRepository,
  ) {}

  @get('/friends/{id}/friend-intolerances', {
    responses: {
      '200': {
        description: 'Array of Friend has many FriendIntolerance',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(FriendIntolerance),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<FriendIntolerance>,
  ): Promise<FriendIntolerance[]> {
    return this.friendRepository
      .intolerances(id)
      .find(filter, {strictObjectIDCoercion: true});
  }

  @post('/friends/{id}/friend-intolerances', {
    responses: {
      '200': {
        description: 'Friend model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(FriendIntolerance)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Friend.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FriendIntolerance, {
            title: 'NewFriendIntoleranceInFriend',
            exclude: ['id'],
            optional: ['friendId'],
          }),
        },
      },
    })
    friendIntolerance: Omit<FriendIntolerance, 'id'>,
  ): Promise<FriendIntolerance> {
    return this.friendRepository.intolerances(id).create(friendIntolerance);
  }

  @patch('/friends/{id}/friend-intolerances', {
    responses: {
      '200': {
        description: 'Friend.FriendIntolerance PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FriendIntolerance, {partial: true}),
        },
      },
    })
    friendIntolerance: Partial<FriendIntolerance>,
    @param.query.object('where', getWhereSchemaFor(FriendIntolerance))
    where?: Where<FriendIntolerance>,
  ): Promise<Count> {
    return this.friendRepository
      .intolerances(id)
      .patch(friendIntolerance, where, {strictObjectIDCoercion: true});
  }

  @del('/friends/{id}/friend-intolerances', {
    responses: {
      '200': {
        description: 'Friend.FriendIntolerance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(FriendIntolerance))
    where?: Where<FriendIntolerance>,
  ): Promise<Count> {
    return this.friendRepository
      .intolerances(id)
      .delete(where, {strictObjectIDCoercion: true});
  }
}
