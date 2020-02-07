import {FoodRepository} from './../repositories/food.repository';
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
import {Recipe, Ingrediant} from '../models';
import {RecipeRepository, IngrediantRepository} from '../repositories';

export class RecipeIngrediantController {
  constructor(
    @repository(RecipeRepository)
    protected recipeRepository: RecipeRepository,
    @repository(FoodRepository) protected foodRepository: FoodRepository,
    @repository(IngrediantRepository)
    protected ingrediantRepository: IngrediantRepository,
  ) {}

  @get('/recipes/{id}/ingrediants', {
    responses: {
      '200': {
        description: 'Array of Recipe has many Ingrediant',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Ingrediant),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Ingrediant>,
  ): Promise<Ingrediant[]> {
    let myFilter: Filter<Ingrediant> = {};
    if (filter) {
      myFilter = filter;
    }
    myFilter.where = {
      recipeId: id,
    };
    return this.ingrediantRepository.find(myFilter, {
      strictObjectIDCoercion: true,
    });
  }

  @post('/recipes/{id}/ingrediants', {
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Ingrediant)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Recipe.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ingrediant, {
            title: 'NewIngrediantInRecipe',
            exclude: ['id', 'recipeId'],
          }),
        },
      },
    })
    ingrediant: Omit<Ingrediant, 'id'>,
  ): Promise<Ingrediant> {
    await this.foodRepository.findById(ingrediant.foodId);
    return this.recipeRepository.ingrediants(id).create(ingrediant);
  }

  @patch('/recipes/{id}/ingrediants', {
    responses: {
      '200': {
        description: 'Recipe.Ingrediant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ingrediant, {partial: true}),
        },
      },
    })
    ingrediant: Partial<Ingrediant>,
    @param.query.object('where', getWhereSchemaFor(Ingrediant))
    where?: Where<Ingrediant>,
  ): Promise<Count> {
    return this.recipeRepository.ingrediants(id).patch(ingrediant, where);
  }

  @del('/recipes/{id}/ingrediants', {
    responses: {
      '200': {
        description: 'Recipe.Ingrediant DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Ingrediant))
    where?: Where<Ingrediant>,
  ): Promise<Count> {
    return this.recipeRepository.ingrediants(id).delete(where);
  }
}
