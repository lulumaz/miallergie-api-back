import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Allergy} from '../models';
import {AllergyRepository} from '../repositories';

export class AllergyController {
  constructor(
    @repository(AllergyRepository)
    public allergyRepository: AllergyRepository,
  ) {}

  @post('/allergies', {
    responses: {
      '200': {
        description: 'Allergy model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Allergy),
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Allergy, {
            title: 'NewAllergy',
            exclude: ['id', 'validate', 'createAt'],
          }),
        },
      },
    })
    allergy: Omit<Allergy, 'id'>,
  ): Promise<Allergy> {
    return this.allergyRepository.create(allergy);
  }

  @get('/allergies/count', {
    responses: {
      '200': {
        description: 'Allergy model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Allergy))
    where?: Where<Allergy>,
  ): Promise<Count> {
    return this.allergyRepository.count(where);
  }

  @get('/allergies', {
    responses: {
      '200': {
        description: 'Array of Allergy model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Allergy, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Allergy))
    filter?: Filter<Allergy>,
  ): Promise<Allergy[]> {
    return this.allergyRepository.find(filter);
  }

  @patch('/allergies', {
    responses: {
      '200': {
        description: 'Allergy PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Allergy, {partial: true}),
        },
      },
    })
    allergy: Allergy,
    @param.query.object('where', getWhereSchemaFor(Allergy))
    where?: Where<Allergy>,
  ): Promise<Count> {
    return this.allergyRepository.updateAll(allergy, where);
  }

  @get('/allergies/{id}', {
    responses: {
      '200': {
        description: 'Allergy model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Allergy, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Allergy))
    filter?: Filter<Allergy>,
  ): Promise<Allergy> {
    return this.allergyRepository.findById(id, filter);
  }

  @patch('/allergies/{id}', {
    responses: {
      '204': {
        description: 'Allergy PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Allergy, {partial: true}),
        },
      },
    })
    allergy: Allergy,
  ): Promise<void> {
    await this.allergyRepository.updateById(id, allergy);
  }

  @put('/allergies/{id}', {
    responses: {
      '204': {
        description: 'Allergy PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() allergy: Allergy,
  ): Promise<void> {
    await this.allergyRepository.replaceById(id, allergy);
  }

  @del('/allergies/{id}', {
    responses: {
      '204': {
        description: 'Allergy DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.allergyRepository.deleteById(id);
  }
}
