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
import {Food, Intolerance} from '../models';
import {FoodRepository} from '../repositories';

export class FoodIntoleranceController {
  constructor(
    @repository(FoodRepository) protected foodRepository: FoodRepository,
  ) {}

  @get('/foods/{id}/intolerances', {
    responses: {
      '200': {
        description: "Array of Intolerance's belonging to Food",
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Intolerance)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Intolerance>,
  ): Promise<Intolerance[]> {
    return this.foodRepository.intolerances(id).find(filter);
  }

  @post('/foods/{id}/intolerances', {
    responses: {
      '200': {
        description: 'Food model instance',
        content: {'application/json': {schema: getModelSchemaRef(Intolerance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Food.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Intolerance, {
            title: 'NewIntoleranceInFood',
            exclude: ['id'],
          }),
        },
      },
    })
    intolerance: Omit<Intolerance, 'id'>,
  ): Promise<Intolerance> {
    return this.foodRepository.intolerances(id).create(intolerance);
  }

  @patch('/foods/{id}/intolerances', {
    responses: {
      '200': {
        description: 'Food.Intolerance PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Intolerance, {partial: true}),
        },
      },
    })
    intolerance: Partial<Intolerance>,
    @param.query.object('where', getWhereSchemaFor(Intolerance))
    where?: Where<Intolerance>,
  ): Promise<Count> {
    return this.foodRepository.intolerances(id).patch(intolerance, where);
  }

  @del('/foods/{id}/intolerances', {
    responses: {
      '200': {
        description: 'Food.Intolerance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Intolerance))
    where?: Where<Intolerance>,
  ): Promise<Count> {
    return this.foodRepository.intolerances(id).delete(where);
  }
}
