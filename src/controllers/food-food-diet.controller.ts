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
import {Food, FoodDiet} from '../models';
import {FoodRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';

@authenticate('jwt')
export class FoodFoodDietController {
  constructor(
    @repository(FoodRepository) protected foodRepository: FoodRepository,
  ) {}

  @get('/foods/{id}/food-diets', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Food has many FoodDiet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FoodDiet)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<FoodDiet>,
  ): Promise<FoodDiet[]> {
    return this.foodRepository
      .foodDiets(id)
      .find(filter, {strictObjectIDCoercion: true});
  }

  @post('/foods/{id}/food-diets', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Food model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodDiet)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Food.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodDiet, {
            title: 'NewFoodDietInFood',
            exclude: ['id'],
            optional: ['foodId'],
          }),
        },
      },
    })
    foodDiet: Omit<FoodDiet, 'id'>,
  ): Promise<FoodDiet> {
    return this.foodRepository.foodDiets(id).create(foodDiet);
  }

  @patch('/foods/{id}/food-diets', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Food.FoodDiet PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodDiet, {partial: true}),
        },
      },
    })
    foodDiet: Partial<FoodDiet>,
    @param.query.object('where', getWhereSchemaFor(FoodDiet))
    where?: Where<FoodDiet>,
  ): Promise<Count> {
    return this.foodRepository
      .foodDiets(id)
      .patch(foodDiet, where, {strictObjectIDCoercion: true});
  }

  @del('/foods/{id}/food-diets', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Food.FoodDiet DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(FoodDiet))
    where?: Where<FoodDiet>,
  ): Promise<Count> {
    return this.foodRepository
      .foodDiets(id)
      .delete(where, {strictObjectIDCoercion: true});
  }
}
