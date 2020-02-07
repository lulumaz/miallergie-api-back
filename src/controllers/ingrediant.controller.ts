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
import {Ingrediant} from '../models';
import {IngrediantRepository} from '../repositories';

export class IngrediantController {
  constructor(
    @repository(IngrediantRepository)
    public ingrediantRepository : IngrediantRepository,
  ) {}

  @post('/ingrediants', {
    responses: {
      '200': {
        description: 'Ingrediant model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ingrediant)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ingrediant, {
            title: 'NewIngrediant',
            exclude: ['id'],
          }),
        },
      },
    })
    ingrediant: Omit<Ingrediant, 'id'>,
  ): Promise<Ingrediant> {
    return this.ingrediantRepository.create(ingrediant);
  }

  @get('/ingrediants/count', {
    responses: {
      '200': {
        description: 'Ingrediant model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Ingrediant)) where?: Where<Ingrediant>,
  ): Promise<Count> {
    return this.ingrediantRepository.count(where);
  }

  @get('/ingrediants', {
    responses: {
      '200': {
        description: 'Array of Ingrediant model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Ingrediant, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Ingrediant)) filter?: Filter<Ingrediant>,
  ): Promise<Ingrediant[]> {
    return this.ingrediantRepository.find(filter);
  }

  @patch('/ingrediants', {
    responses: {
      '200': {
        description: 'Ingrediant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ingrediant, {partial: true}),
        },
      },
    })
    ingrediant: Ingrediant,
    @param.query.object('where', getWhereSchemaFor(Ingrediant)) where?: Where<Ingrediant>,
  ): Promise<Count> {
    return this.ingrediantRepository.updateAll(ingrediant, where);
  }

  @get('/ingrediants/{id}', {
    responses: {
      '200': {
        description: 'Ingrediant model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Ingrediant, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Ingrediant)) filter?: Filter<Ingrediant>
  ): Promise<Ingrediant> {
    return this.ingrediantRepository.findById(id, filter);
  }

  @patch('/ingrediants/{id}', {
    responses: {
      '204': {
        description: 'Ingrediant PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ingrediant, {partial: true}),
        },
      },
    })
    ingrediant: Ingrediant,
  ): Promise<void> {
    await this.ingrediantRepository.updateById(id, ingrediant);
  }

  @put('/ingrediants/{id}', {
    responses: {
      '204': {
        description: 'Ingrediant PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ingrediant: Ingrediant,
  ): Promise<void> {
    await this.ingrediantRepository.replaceById(id, ingrediant);
  }

  @del('/ingrediants/{id}', {
    responses: {
      '204': {
        description: 'Ingrediant DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.ingrediantRepository.deleteById(id);
  }
}
