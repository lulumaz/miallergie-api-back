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
  Intolerance,
} from '../models';
import {FoodIntoleranceRepository} from '../repositories';

export class FoodIntoleranceIntoleranceController {
  constructor(
    @repository(FoodIntoleranceRepository)
    public foodIntoleranceRepository: FoodIntoleranceRepository,
  ) { }

  @get('/food-intolerances/{id}/intolerance', {
    responses: {
      '200': {
        description: 'Intolerance belonging to FoodIntolerance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Intolerance)},
          },
        },
      },
    },
  })
  async getIntolerance(
    @param.path.string('id') id: typeof FoodIntolerance.prototype.id,
  ): Promise<Intolerance> {
    return this.foodIntoleranceRepository.intolerance(id);
  }
}
