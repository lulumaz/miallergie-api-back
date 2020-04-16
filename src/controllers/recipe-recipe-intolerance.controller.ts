import {authenticate} from '@loopback/authentication';
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
import {Recipe, RecipeIntolerance} from '../models';
import {RecipeRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';

@authenticate('jwt')
export class RecipeRecipeIntoleranceController {
  constructor(
    @repository(RecipeRepository) protected recipeRepository: RecipeRepository,
  ) {}

  @get('/recipes/{id}/recipe-intolerances', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Recipe has many RecipeIntolerance',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(RecipeIntolerance),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<RecipeIntolerance>,
  ): Promise<RecipeIntolerance[]> {
    return this.recipeRepository.recipeIntolerances(id).find(filter);
  }

  @post('/recipes/{id}/recipe-intolerances', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(RecipeIntolerance)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Recipe.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeIntolerance, {
            title: 'NewRecipeIntoleranceInRecipe',
            exclude: ['id'],
            optional: ['recipeId'],
          }),
        },
      },
    })
    recipeIntolerance: Omit<RecipeIntolerance, 'id'>,
  ): Promise<RecipeIntolerance> {
    return this.recipeRepository
      .recipeIntolerances(id)
      .create(recipeIntolerance);
  }

  @patch('/recipes/{id}/recipe-intolerances', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Recipe.RecipeIntolerance PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeIntolerance, {partial: true}),
        },
      },
    })
    recipeIntolerance: Partial<RecipeIntolerance>,
    @param.query.object('where', getWhereSchemaFor(RecipeIntolerance))
    where?: Where<RecipeIntolerance>,
  ): Promise<Count> {
    return this.recipeRepository
      .recipeIntolerances(id)
      .patch(recipeIntolerance, where);
  }

  @del('/recipes/{id}/recipe-intolerances', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Recipe.RecipeIntolerance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(RecipeIntolerance))
    where?: Where<RecipeIntolerance>,
  ): Promise<Count> {
    return this.recipeRepository.recipeIntolerances(id).delete(where);
  }
}
