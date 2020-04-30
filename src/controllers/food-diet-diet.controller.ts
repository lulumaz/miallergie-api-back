import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  FoodDiet,
  Diet,
} from '../models';
import {FoodDietRepository} from '../repositories';

export class FoodDietDietController {
  constructor(
    @repository(FoodDietRepository)
    public foodDietRepository: FoodDietRepository,
  ) { }

  @get('/food-diets/{id}/diet', {
    responses: {
      '200': {
        description: 'Diet belonging to FoodDiet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Diet)},
          },
        },
      },
    },
  })
  async getDiet(
    @param.path.string('id') id: typeof FoodDiet.prototype.id,
  ): Promise<Diet> {
    return this.foodDietRepository.diet(id);
  }
}
