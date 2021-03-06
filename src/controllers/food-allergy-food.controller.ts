import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {FoodAllergy, Food} from '../models';
import {FoodAllergyRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';

@authenticate('jwt')
export class FoodAllergyFoodController {
  constructor(
    @repository(FoodAllergyRepository)
    public foodAllergyRepository: FoodAllergyRepository,
  ) {}

  @get('/food-allergies/{id}/food', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Food belonging to FoodAllergy',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Food)},
          },
        },
      },
    },
  })
  async getFood(
    @param.path.string('id') id: typeof FoodAllergy.prototype.id,
  ): Promise<Food> {
    return this.foodAllergyRepository.food(id);
  }
}
