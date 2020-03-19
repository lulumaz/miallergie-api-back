import {authorize} from '@loopback/authorization';
import {authenticate} from '@loopback/authentication';
import {FoodRepository} from './../repositories/food.repository';
import {Food} from './../models/food.model';
import {repository, property} from '@loopback/repository';
import {IngredientRepository} from './../repositories/ingredient.repository';
import {Ingredient} from './../models/ingredient.model';
import {getModelSchemaRef} from '@loopback/rest';
// Uncomment these imports to begin using these cool features!

import {post, requestBody} from '@loopback/rest';
import {basicAuthorization} from '../services/authorizor';

// import {inject} from '@loopback/context';

export class IntegrationController {
  constructor(
    @repository(IngredientRepository)
    public foodRepository: FoodRepository,
  ) {}

  @post('/foods/integration/', {
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
    allowedRoles: ['Integration'],
    voters: [basicAuthorization],
  })
  async create(
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
    food: Omit<Food, 'id'>,
  ): Promise<Food[]> {
    //TOOD save missing and get id
    return [];
  }
}
