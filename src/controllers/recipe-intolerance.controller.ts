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
import {Recipe, Intolerance} from '../models';
import {RecipeRepository} from '../repositories';

export class RecipeIntoleranceController {
  constructor(
    @repository(RecipeRepository) protected recipeRepository: RecipeRepository,
  ) {}

  @get('/recipes/{id}/intolerances', {
    responses: {
      '200': {
        description: "Array of Intolerance's belonging to Recipe",
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
    return this.recipeRepository.intolerances(id).find(filter);
  }

  @post('/recipes/{id}/intolerances', {
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {'application/json': {schema: getModelSchemaRef(Intolerance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Recipe.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Intolerance, {
            title: 'NewIntoleranceInRecipe',
            exclude: ['id'],
          }),
        },
      },
    })
    intolerance: Omit<Intolerance, 'id'>,
  ): Promise<Intolerance> {
    return this.recipeRepository.intolerances(id).create(intolerance);
  }

  @patch('/recipes/{id}/intolerances', {
    responses: {
      '200': {
        description: 'Recipe.Intolerance PATCH success count',
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
    return this.recipeRepository.intolerances(id).patch(intolerance, where);
  }

  @del('/recipes/{id}/intolerances', {
    responses: {
      '200': {
        description: 'Recipe.Intolerance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Intolerance))
    where?: Where<Intolerance>,
  ): Promise<Count> {
    return this.recipeRepository.intolerances(id).delete(where);
  }
}
