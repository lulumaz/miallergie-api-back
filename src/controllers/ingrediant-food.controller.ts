import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Ingrediant,
  Food,
} from '../models';
import {IngrediantRepository} from '../repositories';

export class IngrediantFoodController {
  constructor(
    @repository(IngrediantRepository)
    public ingrediantRepository: IngrediantRepository,
  ) { }

  @get('/ingrediants/{id}/food', {
    responses: {
      '200': {
        description: 'Food belonging to Ingrediant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Food)},
          },
        },
      },
    },
  })
  async getFood(
    @param.path.string('id') id: typeof Ingrediant.prototype.id,
  ): Promise<Food> {
    return this.ingrediantRepository.food(id);
  }
}
