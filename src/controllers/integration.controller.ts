import {NotFound} from './../utils/error';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Recipe} from './../models/recipe.model';
import {RecipeRepository} from './../repositories/recipe.repository';
import {IntoleranceRepository} from './../repositories/intolerance.repository';
import {Intolerance} from './../models/intolerance.model';
import {DietRepository} from './../repositories/diet.repository';
import {Diet} from './../models/diet.model';
import {AllergyRepository} from './../repositories/allergy.repository';
import {Allergy} from './../models/allergy.model';
import {OPERATION_SECURITY_SPEC} from './../auth/security-spec';
import {authorize} from '@loopback/authorization';
import {authenticate} from '@loopback/authentication';
import {FoodRepository} from './../repositories/food.repository';
import {Food} from './../models/food.model';
import {repository} from '@loopback/repository';
import {getModelSchemaRef} from '@loopback/rest';
// Uncomment these imports to begin using these cool features!

import {post, requestBody} from '@loopback/rest';
import {basicAuthorization} from '../services/authorizor';

// import {inject} from '@loopback/context';

export class IntegrationController {
  constructor(
    @repository(FoodRepository)
    public foodRepository: FoodRepository,
    @repository(AllergyRepository)
    public allergyRepository: AllergyRepository,
    @repository(DietRepository)
    public dietRepository: DietRepository,
    @repository(IntoleranceRepository)
    public intoleranceRepository: IntoleranceRepository,
    @repository(RecipeRepository)
    public recipeRepository: RecipeRepository,
  ) {}

  @post('/foods/integration/', {
    security: OPERATION_SECURITY_SPEC,
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Food, {
              title: 'NewFood',
              exclude: [
                'id',
                'classes',
                'createAt',
                'foodAllergies',
                'foodDiets',
                'foodIntolerances',
                'parent',
              ],
            }),
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Ingredient model instance',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Food, {
                title: 'NewFood',
                exclude: [
                  'classes',
                  'createAt',
                  'foodAllergies',
                  'foodDiets',
                  'foodIntolerances',
                  'parent',
                ],
              }),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['Admin', 'Integration'],
    voters: [basicAuthorization],
  })
  async createFoods(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Food, {
              title: 'NewFood',
              exclude: [
                'id',
                'classes',
                'createAt',
                'foodAllergies',
                'foodDiets',
                'foodIntolerances',
                'parent',
              ],
            }),
          },
        },
      },
    })
    foods: Omit<Food, 'id'>[],
  ): Promise<Food[]> {
    //TOOD save missing and get id
    const res: Food[] = [];
    for (const food of foods) {
      let bddFood = await this.foodRepository.findOne({
        where: {name: food.name},
      });
      if (bddFood === null) {
        //n'existe pas
        //donc création
        bddFood = await this.foodRepository.create(food);
      }

      //récupération de l'id
      res.push(new Food({id: bddFood.id, name: bddFood.name}));
    }
    return res;
  }

  @post('/allergies/integration/', {
    security: OPERATION_SECURITY_SPEC,
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Allergy, {
              title: 'NewAllergies',
              exclude: ['id', 'createAt'],
            }),
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Ingredient model instance',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Allergy, {
                title: 'NewAllergies',
                exclude: ['createAt'],
              }),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['Admin', 'Integration'],
    voters: [basicAuthorization],
  })
  async createAllergies(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Allergy, {
              title: 'NewAllergies',
              exclude: ['id', 'createAt'],
            }),
          },
        },
      },
    })
    allergies: Omit<Allergy, 'id'>[],
  ): Promise<Allergy[]> {
    //TOOD save missing and get id
    const res: Allergy[] = [];
    for (const allergie of allergies) {
      let bddAllergie = await this.allergyRepository.findOne({
        where: {name: allergie.name},
      });
      if (bddAllergie === null) {
        //n'existe pas
        //donc création
        bddAllergie = await this.allergyRepository.create(allergie);
      }

      //récupération de l'id
      res.push(new Allergy({id: bddAllergie.id, name: bddAllergie.name}));
    }
    return res;
  }

  @post('/diets/integration/', {
    security: OPERATION_SECURITY_SPEC,
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Diet, {
              title: 'NewDiets',
              exclude: ['id', 'createAt'],
            }),
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Ingredient model instance',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Diet, {
                title: 'NewDiets',
                exclude: ['createAt'],
              }),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['Admin', 'Integration'],
    voters: [basicAuthorization],
  })
  async createDiets(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Diet, {
              title: 'NewDiets',
              exclude: ['id', 'createAt'],
            }),
          },
        },
      },
    })
    diets: Omit<Diet, 'id'>[],
  ): Promise<Diet[]> {
    //TOOD save missing and get id
    const res: Diet[] = [];
    for (const diet of diets) {
      let bddDiet = await this.dietRepository.findOne({
        where: {name: diet.name},
      });
      if (bddDiet === null) {
        //n'existe pas
        //donc création
        bddDiet = await this.dietRepository.create(diet);
      }

      //récupération de l'id
      res.push(new Diet({id: bddDiet.id, name: bddDiet.name}));
    }
    return res;
  }

  @post('/intolerances/integration/', {
    security: OPERATION_SECURITY_SPEC,
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Intolerance, {
              title: 'NewIntolerances',
              exclude: ['id', 'createAt'],
            }),
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Ingredient model instance',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Intolerance, {
                title: 'NewIntolerances',
                exclude: ['createAt'],
              }),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['Admin', 'Integration'],
    voters: [basicAuthorization],
  })
  async createIntolerance(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Intolerance, {
              title: 'NewIntolerances',
              exclude: ['id', 'createAt'],
            }),
          },
        },
      },
    })
    intolerances: Omit<Intolerance, 'id'>[],
  ): Promise<Intolerance[]> {
    //TOOD save missing and get id
    const res: Intolerance[] = [];
    for (const intolerance of intolerances) {
      let bddIntolerance = await this.intoleranceRepository.findOne({
        where: {name: intolerance.name},
      });
      if (bddIntolerance === null) {
        //n'existe pas
        //donc création
        bddIntolerance = await this.intoleranceRepository.create(intolerance);
      }

      //récupération de l'id
      res.push(
        new Intolerance({
          id: bddIntolerance.id,
          name: bddIntolerance.name,
        }),
      );
    }
    return res;
  }

  @post('/recipes/integration/', {
    security: OPERATION_SECURITY_SPEC,
    requestBody: {
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {
            title: 'NewRecipe',
            exclude: ['id', 'createAt'],
            optional: [
              'difficulty',
              'duration',
              'numberOfPeople',
              'imageId',
              'stages',
              'type',
            ],
          }),
        },
      },
    },
    responses: {
      '200': {
        description: 'Ingredient model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Recipe, {
              title: 'NewRecipe',
              exclude: ['id', 'createAt'],
              optional: [
                'difficulty',
                'duration',
                'numberOfPeople',
                'imageId',
                'stages',
                'type',
              ],
            }),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['Admin', 'Integration'],
    voters: [basicAuthorization],
  })
  async createRecipes(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {
            title: 'NewRecipe',
            exclude: ['id', 'createAt'],
            optional: [
              'difficulty',
              'duration',
              'numberOfPeople',
              'imageId',
              'stages',
              'type',
            ],
          }),
        },
      },
    })
    recipe: Omit<Recipe, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Recipe | null> {
    //TOOD save missing and get id
    let bddRecipe = await this.recipeRepository.findOne({
      where: {name: recipe.name},
    });
    if (bddRecipe === null) {
      //n'existe pas
      //donc création
      //check for diet
      if (recipe.dietId === undefined) {
        throw new NotFound(531, "Properties 'dietId' must be defined");
      }
      recipe.ownerUserId = currentUserProfile.id;
      await this.dietRepository.findById(recipe.dietId);
      bddRecipe = await this.recipeRepository.create(recipe);
    }
    return bddRecipe;
  }
}
