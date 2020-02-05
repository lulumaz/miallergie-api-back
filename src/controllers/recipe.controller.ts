import {OutputRecipe} from './../models/output/output-recipe.model';
import {InputRecipe} from './../models/input/input-recipe.model';
import {DietRepository} from './../repositories/diet.repository';
import {inject} from '@loopback/core';
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
  RestBindings,
  Response,
} from '@loopback/rest';
import {Recipe} from '../models';
import {RecipeRepository} from '../repositories';

export class RecipeController {
  constructor(
    @repository(RecipeRepository)
    public recipeRepository: RecipeRepository,
    @repository(DietRepository)
    public dietRepository: DietRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) {}

  @post('/recipes', {
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(OutputRecipe)},
        },
      },
      '531': {
        description: "Properties 'dietId' must be defined",
        content: {'application/json': {error: 'string'}},
      },
      '532': {
        description: "Properties 'dietId' must be defined",
        content: {'application/json': {error: 'string'}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InputRecipe, {
            title: 'NewRecipe',
            exclude: ['id'],
          }),
        },
      },
    })
    recipe: Omit<Recipe, 'id'>,
  ): Promise<Recipe | {error: string}> {
    //TODO: verif if allergy,intol, diet, ingrediant exist
    //check for diet
    if (recipe.dietId === undefined) {
      this.response.status(531);
      return {error: "Properties 'dietId' must be defined"};
    }
    const diet = await this.dietRepository.findById(recipe.dietId);
    if (!diet) {
      this.response.status(532);
      return {error: 'dietId:' + recipe.dietId + ' does not exist in ddb'};
    }

    return this.recipeRepository.create(recipe);
  }

  @get('/recipes/count', {
    responses: {
      '200': {
        description: 'Recipe model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Recipe))
    where?: Where<Recipe>,
  ): Promise<Count> {
    return this.recipeRepository.count(where);
  }

  @get('/recipes', {
    responses: {
      '200': {
        description: 'Array of Recipe model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Recipe, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Recipe))
    filter?: Filter<Recipe>,
  ): Promise<Recipe[]> {
    //TODO: add filter
    //TODO: detail elements
    return this.recipeRepository.find(filter);
  }

  @patch('/recipes', {
    responses: {
      '200': {
        description: 'Recipe PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {partial: true}),
        },
      },
    })
    recipe: Recipe,
    @param.query.object('where', getWhereSchemaFor(Recipe))
    where?: Where<Recipe>,
  ): Promise<Count> {
    return this.recipeRepository.updateAll(recipe, where);
  }

  @get('/recipes/{id}', {
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Recipe, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Recipe))
    filter?: Filter<Recipe>,
  ): Promise<Recipe> {
    //TODO: add details
    return this.recipeRepository.findById(id, filter);
  }

  @patch('/recipes/{id}', {
    responses: {
      '204': {
        description: 'Recipe PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {partial: true}),
        },
      },
    })
    recipe: Recipe,
  ): Promise<void> {
    await this.recipeRepository.updateById(id, recipe);
  }

  @put('/recipes/{id}', {
    responses: {
      '204': {
        description: 'Recipe PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() recipe: Recipe,
  ): Promise<void> {
    //TODO: control data
    await this.recipeRepository.replaceById(id, recipe);
  }

  @del('/recipes/{id}', {
    responses: {
      '204': {
        description: 'Recipe DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.recipeRepository.deleteById(id);
  }
}