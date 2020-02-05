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
import {Intolerance} from '../models';
import {IntoleranceRepository} from '../repositories';

export class IntoleranceController {
  constructor(
    @repository(IntoleranceRepository)
    public intoleranceRepository: IntoleranceRepository,
  ) {}

  @post('/intolerances', {
    responses: {
      '200': {
        description: 'Intolerance model instance',
        content: {'application/json': {schema: getModelSchemaRef(Intolerance)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Intolerance, {
            title: 'NewIntolerance',
            exclude: ['id', 'validate', 'createAt'],
          }),
        },
      },
    })
    intolerance: Omit<Intolerance, 'id'>,
  ): Promise<Intolerance> {
    return this.intoleranceRepository.create(intolerance);
  }

  @get('/intolerances/count', {
    responses: {
      '200': {
        description: 'Intolerance model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Intolerance))
    where?: Where<Intolerance>,
  ): Promise<Count> {
    return this.intoleranceRepository.count(where);
  }

  @get('/intolerances', {
    responses: {
      '200': {
        description: 'Array of Intolerance model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Intolerance, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Intolerance))
    filter?: Filter<Intolerance>,
  ): Promise<Intolerance[]> {
    return this.intoleranceRepository.find(filter);
  }

  @patch('/intolerances', {
    responses: {
      '200': {
        description: 'Intolerance PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Intolerance, {partial: true}),
        },
      },
    })
    intolerance: Intolerance,
    @param.query.object('where', getWhereSchemaFor(Intolerance))
    where?: Where<Intolerance>,
  ): Promise<Count> {
    return this.intoleranceRepository.updateAll(intolerance, where);
  }

  @get('/intolerances/{id}', {
    responses: {
      '200': {
        description: 'Intolerance model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Intolerance, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Intolerance))
    filter?: Filter<Intolerance>,
  ): Promise<Intolerance> {
    return this.intoleranceRepository.findById(id, filter);
  }

  @patch('/intolerances/{id}', {
    responses: {
      '204': {
        description: 'Intolerance PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Intolerance, {partial: true}),
        },
      },
    })
    intolerance: Intolerance,
  ): Promise<void> {
    await this.intoleranceRepository.updateById(id, intolerance);
  }

  @put('/intolerances/{id}', {
    responses: {
      '204': {
        description: 'Intolerance PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() intolerance: Intolerance,
  ): Promise<void> {
    await this.intoleranceRepository.replaceById(id, intolerance);
  }

  @del('/intolerances/{id}', {
    responses: {
      '204': {
        description: 'Intolerance DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.intoleranceRepository.deleteById(id);
  }
}
