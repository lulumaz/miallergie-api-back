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
  Food,
  FoodIntolerance,
} from '../models';
import {FoodRepository} from '../repositories';

export class FoodFoodIntoleranceController {
  constructor(
    @repository(FoodRepository) protected foodRepository: FoodRepository,
  ) { }

  @get('/foods/{id}/food-intolerances', {
    responses: {
      '200': {
        description: 'Array of Food has many FoodIntolerance',
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
    return this.foodRepository.foodIntolerances(id).find(filter);
  }

  @post('/foods/{id}/food-intolerances', {
    responses: {
      '200': {
        description: 'Food model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodIntolerance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Food.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodIntolerance, {
            title: 'NewFoodIntoleranceInFood',
            exclude: ['id'],
            optional: ['foodId']
          }),
        },
      },
    }) foodIntolerance: Omit<FoodIntolerance, 'id'>,
  ): Promise<FoodIntolerance> {
    return this.foodRepository.foodIntolerances(id).create(foodIntolerance);
  }

  @patch('/foods/{id}/food-intolerances', {
    responses: {
      '200': {
        description: 'Food.FoodIntolerance PATCH success count',
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
    @param.query.object('where', getWhereSchemaFor(FoodIntolerance)) where?: Where<FoodIntolerance>,
  ): Promise<Count> {
    return this.foodRepository.foodIntolerances(id).patch(foodIntolerance, where);
  }

  @del('/foods/{id}/food-intolerances', {
    responses: {
      '200': {
        description: 'Food.FoodIntolerance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(FoodIntolerance)) where?: Where<FoodIntolerance>,
  ): Promise<Count> {
    return this.foodRepository.foodIntolerances(id).delete(where);
  }
}
