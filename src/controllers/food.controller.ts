import {FoodDietWithRelations} from './../models/food-diet.model';
import {FoodAllergyWithRelations} from './../models/food-allergy.model';
import {FoodIntoleranceWithRelations} from './../models/food-intolerance.model';
import {IntoleranceRepository} from './../repositories/intolerance.repository';
import {AllergyRepository} from './../repositories/allergy.repository';
import {DietRepository} from './../repositories/diet.repository';
import {OPERATION_SECURITY_SPEC} from './../auth/security-spec';
import {authenticate} from '@loopback/authentication';
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
} from '@loopback/rest';
import {Food} from '../models';
import {FoodRepository} from '../repositories';

@authenticate('jwt')
export class FoodController {
  constructor(
    @repository(FoodRepository)
    public foodRepository: FoodRepository,
    @repository(DietRepository)
    public dietRepository: DietRepository,
    @repository(AllergyRepository)
    public allergyRepository: AllergyRepository,
    @repository(IntoleranceRepository)
    public intoleranceRepository: IntoleranceRepository,
  ) {}

  @post('/foods', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Food model instance',
        content: {'application/json': {schema: getModelSchemaRef(Food)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Food, {
            title: 'NewFood',
            exclude: ['id', 'createAt'],
          }),
        },
      },
    })
    food: Omit<Food, 'id'>,
  ): Promise<Food> {
    return this.foodRepository.create(food);
  }

  @get('/foods/count', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Food model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Food)) where?: Where<Food>,
  ): Promise<Count> {
    return this.foodRepository.count(where);
  }

  @get('/foods', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Food model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Food, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Food))
    filter?: Filter<Food>,
  ): Promise<Food[]> {
    const foods: Food[] = await this.foodRepository.find(filter);
    if (filter?.include) {
      for (const include of filter?.include) {
        const relation = include.relation;
        if (relation === 'foodIntolerances') {
          for (const food of foods) {
            try {
              food.foodIntolerances = await this.foodRepository
                .foodIntolerances(food.id)
                .find({}, {strictObjectIDCoercion: true});
              const foodIntolerances: FoodIntoleranceWithRelations[] =
                food.foodIntolerances;
              for (const foodIntolerance of foodIntolerances) {
                foodIntolerance.intolerance = await this.intoleranceRepository.findById(
                  foodIntolerance.intoleranceId,
                );
              }
            } catch (error) {
              console.error(error);
            }
          }
        } else if (relation === 'foodAllergies') {
          for (const food of foods) {
            try {
              food.foodAllergies = await this.foodRepository
                .foodAllergies(food.id)
                .find({}, {strictObjectIDCoercion: true});
              const foodAllergies: FoodAllergyWithRelations[] =
                food.foodAllergies;
              for (const foodAllergie of foodAllergies) {
                foodAllergie.allergy = await this.allergyRepository.findById(
                  foodAllergie.allergyId,
                );
              }
            } catch (error) {
              console.error(error);
            }
          }
        } else if (relation === 'foodDiets') {
          try {
            for (const food of foods) {
              food.foodDiets = await this.foodRepository
                .foodDiets(food.id)
                .find({}, {strictObjectIDCoercion: true});
              const foodDiets: FoodDietWithRelations[] = food.foodDiets;
              for (const foodDiet of foodDiets) {
                foodDiet.diet = await this.dietRepository.findById(
                  foodDiet.dietId,
                );
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }

    return foods;
  }

  @patch('/foods', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Food PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Food, {partial: true}),
        },
      },
    })
    food: Food,
    @param.query.object('where', getWhereSchemaFor(Food)) where?: Where<Food>,
  ): Promise<Count> {
    return this.foodRepository.updateAll(food, where);
  }

  @get('/foods/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Food model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Food, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Food))
    filter?: Filter<Food>,
  ): Promise<Food> {
    return this.foodRepository.findById(id, filter);
  }

  @patch('/foods/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Food PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Food, {partial: true}),
        },
      },
    })
    food: Food,
  ): Promise<void> {
    await this.foodRepository.updateById(id, food);
  }

  @put('/foods/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Food PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() food: Food,
  ): Promise<void> {
    await this.foodRepository.replaceById(id, food);
  }

  @del('/foods/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Food DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.foodRepository.deleteById(id);
  }
}
