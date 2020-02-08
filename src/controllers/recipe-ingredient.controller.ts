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
import {
  Recipe,
  Ingredient,
} from '../models';
import {RecipeRepository} from '../repositories';

export class RecipeIngredientController {
  constructor(
    @repository(RecipeRepository) protected recipeRepository: RecipeRepository,
  ) { }

  @get('/recipes/{id}/ingredients', {
    responses: {
      '200': {
        description: 'Array of Recipe has many Ingredient',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Ingredient)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Ingredient>,
  ): Promise<Ingredient[]> {
    return this.recipeRepository.ingredients(id).find(filter);
  }

  @post('/recipes/{id}/ingredients', {
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ingredient)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Recipe.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ingredient, {
            title: 'NewIngredientInRecipe',
            exclude: ['id'],
            optional: ['recipeId']
          }),
        },
      },
    }) ingredient: Omit<Ingredient, 'id'>,
  ): Promise<Ingredient> {
    return this.recipeRepository.ingredients(id).create(ingredient);
  }

  @patch('/recipes/{id}/ingredients', {
    responses: {
      '200': {
        description: 'Recipe.Ingredient PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ingredient, {partial: true}),
        },
      },
    })
    ingredient: Partial<Ingredient>,
    @param.query.object('where', getWhereSchemaFor(Ingredient)) where?: Where<Ingredient>,
  ): Promise<Count> {
    return this.recipeRepository.ingredients(id).patch(ingredient, where);
  }

  @del('/recipes/{id}/ingredients', {
    responses: {
      '200': {
        description: 'Recipe.Ingredient DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Ingredient)) where?: Where<Ingredient>,
  ): Promise<Count> {
    return this.recipeRepository.ingredients(id).delete(where);
  }
}
