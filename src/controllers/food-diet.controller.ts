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
import {Food, Diet} from '../models';
import {FoodRepository} from '../repositories';

export class FoodDietController {
  constructor(
    @repository(FoodRepository) protected foodRepository: FoodRepository,
  ) {}

  @get('/foods/{id}/diets', {
    responses: {
      '200': {
        description: "Array of Diet's belonging to Food",
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Diet)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Diet>,
  ): Promise<Diet[]> {
    return this.foodRepository.diets(id).find(filter);
  }

  @post('/foods/{id}/diets', {
    responses: {
      '200': {
        description: 'Food model instance',
        content: {'application/json': {schema: getModelSchemaRef(Diet)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Food.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diet, {
            title: 'NewDietInFood',
            exclude: ['id'],
          }),
        },
      },
    })
    diet: Omit<Diet, 'id'>,
  ): Promise<Diet> {
    return this.foodRepository.diets(id).create(diet);
  }

  @patch('/foods/{id}/diets', {
    responses: {
      '200': {
        description: 'Food.Diet PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diet, {partial: true}),
        },
      },
    })
    diet: Partial<Diet>,
    @param.query.object('where', getWhereSchemaFor(Diet)) where?: Where<Diet>,
  ): Promise<Count> {
    return this.foodRepository.diets(id).patch(diet, where);
  }

  @del('/foods/{id}/diets', {
    responses: {
      '200': {
        description: 'Food.Diet DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Diet)) where?: Where<Diet>,
  ): Promise<Count> {
    return this.foodRepository.diets(id).delete(where);
  }
}
