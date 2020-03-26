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
import {Recipe, RecipeDiet} from '../models';
import {RecipeRepository} from '../repositories';

@authenticate('jwt')
export class RecipeRecipeDietController {
  constructor(
    @repository(RecipeRepository) protected recipeRepository: RecipeRepository,
  ) {}

  @get('/recipes/{id}/recipe-diets', {
    responses: {
      '200': {
        description: 'Array of Recipe has many RecipeDiet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RecipeDiet)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<RecipeDiet>,
  ): Promise<RecipeDiet[]> {
    let myFilter: Filter<RecipeDiet> = {};
    if (filter) {
      myFilter = filter;
    }
    myFilter.where = {
      recipeId: id,
    };
    return this.recipeRepository.diets(id).find(myFilter, {
      strictObjectIDCoercion: true,
    });
  }

  @post('/recipes/{id}/recipe-diets', {
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {'application/json': {schema: getModelSchemaRef(RecipeDiet)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Recipe.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeDiet, {
            title: 'NewRecipeDietInRecipe',
            exclude: ['id', 'recipeId'],
          }),
        },
      },
    })
    recipeDiet: Omit<RecipeDiet, 'id'>,
  ): Promise<RecipeDiet> {
    return this.recipeRepository.diets(id).create(recipeDiet);
  }

  @patch('/recipes/{id}/recipe-diets', {
    responses: {
      '200': {
        description: 'Recipe.RecipeDiet PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeDiet, {partial: true}),
        },
      },
    })
    recipeDiet: Partial<RecipeDiet>,
    @param.query.object('where', getWhereSchemaFor(RecipeDiet))
    where?: Where<RecipeDiet>,
  ): Promise<Count> {
    return this.recipeRepository.diets(id).patch(recipeDiet, where);
  }

  @del('/recipes/{id}/recipe-diets', {
    responses: {
      '200': {
        description: 'Recipe.RecipeDiet DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(RecipeDiet))
    where?: Where<RecipeDiet>,
  ): Promise<Count> {
    return this.recipeRepository.diets(id).delete(where);
  }
}
