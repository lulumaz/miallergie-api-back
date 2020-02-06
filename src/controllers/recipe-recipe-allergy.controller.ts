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
  RecipeAllergy,
} from '../models';
import {RecipeRepository} from '../repositories';

export class RecipeRecipeAllergyController {
  constructor(
    @repository(RecipeRepository) protected recipeRepository: RecipeRepository,
  ) { }

  @get('/recipes/{id}/recipe-allergies', {
    responses: {
      '200': {
        description: 'Array of Recipe has many RecipeAllergy',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RecipeAllergy)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<RecipeAllergy>,
  ): Promise<RecipeAllergy[]> {
    return this.recipeRepository.recipeAllergies(id).find(filter);
  }

  @post('/recipes/{id}/recipe-allergies', {
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {'application/json': {schema: getModelSchemaRef(RecipeAllergy)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Recipe.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeAllergy, {
            title: 'NewRecipeAllergyInRecipe',
            exclude: ['id'],
            optional: ['recipeId']
          }),
        },
      },
    }) recipeAllergy: Omit<RecipeAllergy, 'id'>,
  ): Promise<RecipeAllergy> {
    return this.recipeRepository.recipeAllergies(id).create(recipeAllergy);
  }

  @patch('/recipes/{id}/recipe-allergies', {
    responses: {
      '200': {
        description: 'Recipe.RecipeAllergy PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeAllergy, {partial: true}),
        },
      },
    })
    recipeAllergy: Partial<RecipeAllergy>,
    @param.query.object('where', getWhereSchemaFor(RecipeAllergy)) where?: Where<RecipeAllergy>,
  ): Promise<Count> {
    return this.recipeRepository.recipeAllergies(id).patch(recipeAllergy, where);
  }

  @del('/recipes/{id}/recipe-allergies', {
    responses: {
      '200': {
        description: 'Recipe.RecipeAllergy DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(RecipeAllergy)) where?: Where<RecipeAllergy>,
  ): Promise<Count> {
    return this.recipeRepository.recipeAllergies(id).delete(where);
  }
}
