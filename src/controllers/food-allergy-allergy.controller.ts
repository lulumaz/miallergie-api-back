import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  FoodAllergy,
  Allergy,
} from '../models';
import {FoodAllergyRepository} from '../repositories';

export class FoodAllergyAllergyController {
  constructor(
    @repository(FoodAllergyRepository)
    public foodAllergyRepository: FoodAllergyRepository,
  ) { }

  @get('/food-allergies/{id}/allergy', {
    responses: {
      '200': {
        description: 'Allergy belonging to FoodAllergy',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Allergy)},
          },
        },
      },
    },
  })
  async getAllergy(
    @param.path.string('id') id: typeof FoodAllergy.prototype.id,
  ): Promise<Allergy> {
    return this.foodAllergyRepository.allergy(id);
  }
}
