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
    allowedRoles: ['admin', 'integration'],
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
}
