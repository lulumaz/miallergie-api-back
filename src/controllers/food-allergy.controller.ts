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
import {Food, Allergy} from '../models';
import {FoodRepository} from '../repositories';

export class FoodAllergyController {
  constructor(
    @repository(FoodRepository) protected foodRepository: FoodRepository,
  ) {}

  @get('/foods/{id}/allergies', {
    responses: {
      '200': {
        description: "Array of Allergy's belonging to Food",
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Allergy)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Allergy>,
  ): Promise<Allergy[]> {
    return this.foodRepository.allergies(id).find(filter);
  }

  @post('/foods/{id}/allergies', {
    responses: {
      '200': {
        description: 'Food model instance',
        content: {'application/json': {schema: getModelSchemaRef(Allergy)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Food.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Allergy, {
            title: 'NewAllergyInFood',
            exclude: ['id'],
          }),
        },
      },
    })
    allergy: Omit<Allergy, 'id'>,
  ): Promise<Allergy> {
    return this.foodRepository.allergies(id).create(allergy);
  }

  @patch('/foods/{id}/allergies', {
    responses: {
      '200': {
        description: 'Food.Allergy PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Allergy, {partial: true}),
        },
      },
    })
    allergy: Partial<Allergy>,
    @param.query.object('where', getWhereSchemaFor(Allergy))
    where?: Where<Allergy>,
  ): Promise<Count> {
    return this.foodRepository.allergies(id).patch(allergy, where);
  }

  @del('/foods/{id}/allergies', {
    responses: {
      '200': {
        description: 'Food.Allergy DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Allergy))
    where?: Where<Allergy>,
  ): Promise<Count> {
    return this.foodRepository.allergies(id).delete(where);
  }
}