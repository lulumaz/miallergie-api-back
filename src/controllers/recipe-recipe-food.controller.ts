import {RecipeFood} from './../models/recipe-food.model';
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
import {Recipe} from '../models';
import {RecipeRepository} from '../repositories';

export class RecipeRecipeFoodController {
  constructor(
    @repository(RecipeRepository) protected recipeRepository: RecipeRepository,
  ) {}

  @get('/recipes/{id}/recipe-foods', {
    responses: {
      '200': {
        description: "Array of RecipeFood's belonging to Recipe",
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RecipeFood)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<RecipeFood>,
  ): Promise<RecipeFood[]> {
    return this.recipeRepository.recipeFoods(id).find(filter);
  }

  @post('/recipes/{id}/recipe-foods', {
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {'application/json': {schema: getModelSchemaRef(RecipeFood)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Recipe.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeFood, {
            title: 'NewRecipeFoodInRecipe',
            exclude: ['id'],
            optional: ['recipeId'],
          }),
        },
      },
    })
    recipeFood: Omit<RecipeFood, 'id'>,
  ): Promise<RecipeFood> {
    return this.recipeRepository.recipeFoods(id).create(recipeFood);
  }

  @patch('/recipes/{id}/recipe-foods', {
    responses: {
      '200': {
        description: 'Recipe.RecipeFood PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeFood, {partial: true}),
        },
      },
    })
    recipeFood: Partial<RecipeFood>,
    @param.query.object('where', getWhereSchemaFor(RecipeFood))
    where?: Where<RecipeFood>,
  ): Promise<Count> {
    return this.recipeRepository.recipeFoods(id).patch(recipeFood, where);
  }

  @del('/recipes/{id}/recipe-foods', {
    responses: {
      '200': {
        description: 'Recipe.RecipeFood DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(RecipeFood))
    where?: Where<RecipeFood>,
  ): Promise<Count> {
    return this.recipeRepository.recipeFoods(id).delete(where);
  }
}
