import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
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
import {Unit} from '../models';
import {UnitRepository} from '../repositories';

export class UnitController {
  constructor(
    @repository(UnitRepository)
    public unitRepository : UnitRepository,
  ) {}

  @post('/units', {
    responses: {
      '200': {
        description: 'Unit model instance',
        content: {'application/json': {schema: getModelSchemaRef(Unit)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Unit, {
            title: 'NewUnit',
            
          }),
        },
      },
    })
    unit: Unit,
  ): Promise<Unit> {
    return this.unitRepository.create(unit);
  }

  @get('/units/count', {
    responses: {
      '200': {
        description: 'Unit model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Unit) where?: Where<Unit>,
  ): Promise<Count> {
    return this.unitRepository.count(where);
  }

  @get('/units', {
    responses: {
      '200': {
        description: 'Array of Unit model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Unit, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Unit) filter?: Filter<Unit>,
  ): Promise<Unit[]> {
    return this.unitRepository.find(filter);
  }

  @patch('/units', {
    responses: {
      '200': {
        description: 'Unit PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Unit, {partial: true}),
        },
      },
    })
    unit: Unit,
    @param.where(Unit) where?: Where<Unit>,
  ): Promise<Count> {
    return this.unitRepository.updateAll(unit, where);
  }

  @get('/units/{id}', {
    responses: {
      '200': {
        description: 'Unit model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Unit, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Unit, {exclude: 'where'}) filter?: FilterExcludingWhere<Unit>
  ): Promise<Unit> {
    return this.unitRepository.findById(id, filter);
  }

  @patch('/units/{id}', {
    responses: {
      '204': {
        description: 'Unit PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Unit, {partial: true}),
        },
      },
    })
    unit: Unit,
  ): Promise<void> {
    await this.unitRepository.updateById(id, unit);
  }

  @put('/units/{id}', {
    responses: {
      '204': {
        description: 'Unit PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() unit: Unit,
  ): Promise<void> {
    await this.unitRepository.replaceById(id, unit);
  }

  @del('/units/{id}', {
    responses: {
      '204': {
        description: 'Unit DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.unitRepository.deleteById(id);
  }
}
