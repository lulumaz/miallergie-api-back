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
import {Friend, FoodIntolerance} from '../models';
import {FriendRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';

@authenticate('jwt')
export class FriendFoodIntoleranceController {
  constructor(
    @repository(FriendRepository) protected friendRepository: FriendRepository,
  ) {}

  @get('/friends/{id}/food-intolerances', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Friend has many FoodIntolerance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FoodIntolerance)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<FoodIntolerance>,
  ): Promise<FoodIntolerance[]> {
    return this.friendRepository.intolerances(id).find(filter);
  }

  @post('/friends/{id}/food-intolerances', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Friend model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(FoodIntolerance)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Friend.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodIntolerance, {
            title: 'NewFoodIntoleranceInFriend',
            exclude: ['id'],
            optional: ['friendId'],
          }),
        },
      },
    })
    foodIntolerance: Omit<FoodIntolerance, 'id'>,
  ): Promise<FoodIntolerance> {
    return this.friendRepository.intolerances(id).create(foodIntolerance);
  }

  @patch('/friends/{id}/food-intolerances', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Friend.FoodIntolerance PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodIntolerance, {partial: true}),
        },
      },
    })
    foodIntolerance: Partial<FoodIntolerance>,
    @param.query.object('where', getWhereSchemaFor(FoodIntolerance))
    where?: Where<FoodIntolerance>,
  ): Promise<Count> {
    return this.friendRepository.intolerances(id).patch(foodIntolerance, where);
  }

  @del('/friends/{id}/food-intolerances', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Friend.FoodIntolerance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(FoodIntolerance))
    where?: Where<FoodIntolerance>,
  ): Promise<Count> {
    return this.friendRepository.intolerances(id).delete(where);
  }
}
