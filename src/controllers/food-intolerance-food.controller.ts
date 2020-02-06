import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  FoodIntolerance,
  Food,
} from '../models';
import {FoodIntoleranceRepository} from '../repositories';

export class FoodIntoleranceFoodController {
  constructor(
    @repository(FoodIntoleranceRepository)
    public foodIntoleranceRepository: FoodIntoleranceRepository,
  ) { }

  @get('/food-intolerances/{id}/food', {
    responses: {
      '200': {
        description: 'Food belonging to FoodIntolerance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Food)},
          },
        },
      },
    },
  })
  async getFood(
    @param.path.string('id') id: typeof FoodIntolerance.prototype.id,
  ): Promise<Food> {
    return this.foodIntoleranceRepository.food(id);
  }
}