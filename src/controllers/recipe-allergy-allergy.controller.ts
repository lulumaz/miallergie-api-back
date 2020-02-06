import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  RecipeAllergy,
  Allergy,
} from '../models';
import {RecipeAllergyRepository} from '../repositories';

export class RecipeAllergyAllergyController {
  constructor(
    @repository(RecipeAllergyRepository)
    public recipeAllergyRepository: RecipeAllergyRepository,
  ) { }

  @get('/recipe-allergies/{id}/allergy', {
    responses: {
      '200': {
        description: 'Allergy belonging to RecipeAllergy',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Allergy)},
          },
        },
      },
    },
  })
  async getAllergy(
    @param.path.string('id') id: typeof RecipeAllergy.prototype.id,
  ): Promise<Allergy> {
    return this.recipeAllergyRepository.allergy(id);
  }
}