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
import {Food, FoodAllergy} from '../models';
import {FoodRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';
@authenticate('jwt')
export class FoodFoodAllergyController {
  constructor(
    @repository(FoodRepository) protected foodRepository: FoodRepository,
  ) {}

  @get('/foods/{id}/food-allergies', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Food has many FoodAllergy',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FoodAllergy)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<FoodAllergy>,
  ): Promise<FoodAllergy[]> {
    return this.foodRepository
      .foodAllergies(id)
      .find(filter, {strictObjectIDCoercion: true});
  }

  @post('/foods/{id}/food-allergies', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Food model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodAllergy)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Food.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodAllergy, {
            title: 'NewFoodAllergyInFood',
            exclude: ['id'],
            optional: ['foodId'],
          }),
        },
      },
    })
    foodAllergy: Omit<FoodAllergy, 'id'>,
  ): Promise<FoodAllergy> {
    return this.foodRepository.foodAllergies(id).create(foodAllergy);
  }

  @patch('/foods/{id}/food-allergies', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Food.FoodAllergy PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodAllergy, {partial: true}),
        },
      },
    })
    foodAllergy: Partial<FoodAllergy>,
    @param.query.object('where', getWhereSchemaFor(FoodAllergy))
    where?: Where<FoodAllergy>,
  ): Promise<Count> {
    return this.foodRepository
      .foodAllergies(id)
      .patch(foodAllergy, where, {strictObjectIDCoercion: true});
  }

  @del('/foods/{id}/food-allergies', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Food.FoodAllergy DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(FoodAllergy))
    where?: Where<FoodAllergy>,
  ): Promise<Count> {
    return this.foodRepository
      .foodAllergies(id)
      .delete(where, {strictObjectIDCoercion: true});
  }
}
