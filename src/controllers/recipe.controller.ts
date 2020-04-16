import {authorize} from '@loopback/authorization';
import {OPERATION_SECURITY_SPEC} from './../auth/security-spec';
import {NotFound} from './../utils/error';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {authenticate} from '@loopback/authentication';
import {IngredientRepository} from './../repositories/ingredient.repository';
import {FoodRepository} from './../repositories/food.repository';
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
import {basicAuthorization} from '../services/authorizor';

@authenticate('jwt')
export class RecipeController {
  constructor(
    @repository(RecipeRepository)
    public recipeRepository: RecipeRepository,
    @repository(DietRepository)
    public dietRepository: DietRepository,
    @repository(FoodRepository)
    public foodRepository: FoodRepository,
    @repository(IngredientRepository)
    public ingredientRepository: IngredientRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) {}

  @post('/recipes', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Recipe),
          },
        },
      },
      '531': {
        description: "Properties 'dietId' must be defined",
        content: {'application/json': {error: 'string'}},
      },
      '532': {
        description: 'error while saving ingrediants',
        content: {'application/json': {error: {}}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {
            title: 'NewRecipe',
            exclude: ['id', 'createAt', 'imageId', 'ownerUserId'],
          }),
        },
      },
    })
    recipe: Omit<Recipe, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Recipe> {
    //check for diet
    recipe.ownerUserId = currentUserProfile.id;
    return this.recipeRepository.create(recipe);
  }

  @get('/recipes/count', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Recipe model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(Recipe))
    where?: Where<Recipe>,
  ): Promise<Count> {
    return this.recipeRepository.count(where);
  }

  @get('/recipes', {
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(Recipe))
    filter?: Filter<Recipe>,
  ): Promise<Recipe[]> {
    const strictObjectIDCoercion = true;
    //hotfix
    console.log({filter: filter});
    const recipes: Recipe[] = await this.recipeRepository.find(filter, {
      strictObjectIDCoercion: strictObjectIDCoercion,
    });
    if (
      filter?.include &&
      filter.include[0] &&
      filter.include[0].relation === 'image'
    ) {
      const res: Recipe[] = [];
      for (const recipe of recipes) {
        res.push(
          await this.recipeRepository.findById(recipe.id, {
            include: [{relation: 'image'}],
          }),
        );
      }
      console.log({res});
      return res;
    } else {
      return recipes;
    }
  }

  @post('/recipes/search', {
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  async search(
    @requestBody({
      content: {
        'application/json': {
          schema: getFilterSchemaFor(Recipe),
        },
      },
    })
    filter?: Filter<Recipe>,
  ): Promise<Recipe[]> {
    const strictObjectIDCoercion = true;
    //hotfix
    console.log({filter: filter});
    const recipes: Recipe[] = await this.recipeRepository.find(filter, {
      strictObjectIDCoercion: strictObjectIDCoercion,
    });
    if (
      filter?.include &&
      filter.include[0] &&
      filter.include[0].relation === 'image'
    ) {
      const res: Recipe[] = [];
      for (const recipe of recipes) {
        res.push(
          await this.recipeRepository.findById(recipe.id, {
            include: [{relation: 'image'}],
          }),
        );
      }
      console.log({res});
      return res;
    } else {
      return recipes;
    }
  }

  @patch('/recipes', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Recipe PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['Admin'],
    voters: [basicAuthorization],
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
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Recipe))
    filter?: Filter<Recipe>,
  ): Promise<Recipe> {
    //TODO: add details
    return this.recipeRepository.findById(id, filter);
  }

  @patch('/recipes/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Recipe PATCH success',
      },
      '403': {
        description: 'User is not owner of this resource',
      },
    },
  })
  @authenticate('jwt')
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
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    const currentRecipe = await this.recipeRepository.findById(id);
    if (currentRecipe.ownerUserId.toString() === currentUserProfile.id) {
      await this.recipeRepository.updateById(id, recipe);
    } else {
      throw new NotFound(404, 'User is not owner of this resource');
    }
  }

  @put('/recipes/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Recipe PUT success',
      },
      '403': {
        description: 'User is not owner of this resource',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
    @requestBody() recipe: Recipe,
  ): Promise<void> {
    const currentRecipe = await this.recipeRepository.findById(id);
    if (currentRecipe.ownerUserId.toString() === currentUserProfile.id) {
      await this.recipeRepository.replaceById(id, recipe);
    } else {
      throw new NotFound(404, 'User is not owner of this resource');
    }
  }

  @del('/recipes/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Recipe DELETE success',
      },
      '403': {
        description: 'User is not owner of this resource',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
  ): Promise<void> {
    const recipe = await this.recipeRepository.findById(id);
    if (recipe.ownerUserId.toString() === currentUserProfile.id) {
      await this.recipeRepository.deleteById(id);
    } else {
      throw new NotFound(404, 'User is not owner of this resource');
    }
  }
}
