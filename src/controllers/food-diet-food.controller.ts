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
  Food,
} from '../models';
import {FoodDietRepository} from '../repositories';

export class FoodDietFoodController {
  constructor(
    @repository(FoodDietRepository)
    public foodDietRepository: FoodDietRepository,
  ) { }

  @get('/food-diets/{id}/food', {
    responses: {
      '200': {
        description: 'Food belonging to FoodDiet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Food)},
          },
        },
      },
    },
  })
  async getFood(
    @param.path.string('id') id: typeof FoodDiet.prototype.id,
  ): Promise<Food> {
    return this.foodDietRepository.food(id);
  }
}
