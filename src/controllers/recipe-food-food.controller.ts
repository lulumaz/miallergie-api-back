import {RecipeFood} from './../models/recipe-food.model';
import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Food} from '../models';
import {RecipeFoodRepository} from '../repositories';

export class RecipeFoodFoodController {
  constructor(
    @repository(RecipeFoodRepository)
    public recipeFoodRepository: RecipeFoodRepository,
  ) {}

  @get('/recipe-foods/{id}/food', {
    responses: {
      '200': {
        description: 'Food belonging to RecipeFood',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Food)},
          },
        },
      },
    },
  })
  async getFood(
    @param.path.string('id') id: typeof RecipeFood.prototype.id,
  ): Promise<Food> {
    return this.recipeFoodRepository.food(id);
  }
}
