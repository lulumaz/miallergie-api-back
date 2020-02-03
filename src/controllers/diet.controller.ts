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
import {Diet} from '../models';
import {DietRepository} from '../repositories';

export class DietController {
  constructor(
    @repository(DietRepository)
    public dietRepository : DietRepository,
  ) {}

  @post('/diets', {
    responses: {
      '200': {
        description: 'Diet model instance',
        content: {'application/json': {schema: getModelSchemaRef(Diet)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diet, {
            title: 'NewDiet',
            exclude: ['id'],
          }),
        },
      },
    })
    diet: Omit<Diet, 'id'>,
  ): Promise<Diet> {
    return this.dietRepository.create(diet);
  }

  @get('/diets/count', {
    responses: {
      '200': {
        description: 'Diet model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Diet)) where?: Where<Diet>,
  ): Promise<Count> {
    return this.dietRepository.count(where);
  }

  @get('/diets', {
    responses: {
      '200': {
        description: 'Array of Diet model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Diet, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Diet)) filter?: Filter<Diet>,
  ): Promise<Diet[]> {
    return this.dietRepository.find(filter);
  }

  @patch('/diets', {
    responses: {
      '200': {
        description: 'Diet PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diet, {partial: true}),
        },
      },
    })
    diet: Diet,
    @param.query.object('where', getWhereSchemaFor(Diet)) where?: Where<Diet>,
  ): Promise<Count> {
    return this.dietRepository.updateAll(diet, where);
  }

  @get('/diets/{id}', {
    responses: {
      '200': {
        description: 'Diet model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Diet, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Diet)) filter?: Filter<Diet>
  ): Promise<Diet> {
    return this.dietRepository.findById(id, filter);
  }

  @patch('/diets/{id}', {
    responses: {
      '204': {
        description: 'Diet PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diet, {partial: true}),
        },
      },
    })
    diet: Diet,
  ): Promise<void> {
    await this.dietRepository.updateById(id, diet);
  }

  @put('/diets/{id}', {
    responses: {
      '204': {
        description: 'Diet PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() diet: Diet,
  ): Promise<void> {
    await this.dietRepository.replaceById(id, diet);
  }

  @del('/diets/{id}', {
    responses: {
      '204': {
        description: 'Diet DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.dietRepository.deleteById(id);
  }
}
