import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Ingredient, Food} from '../models';
import {IngredientRepository} from '../repositories';

@authenticate('jwt')
export class IngredientFoodController {
  constructor(
    @repository(IngredientRepository)
    public ingredientRepository: IngredientRepository,
  ) {}

  @get('/ingredients/{id}/food', {
    responses: {
      '200': {
        description: 'Food belonging to Ingredient',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Food)},
          },
        },
      },
    },
  })
  async getFood(
    @param.path.string('id') id: typeof Ingredient.prototype.id,
  ): Promise<Food> {
    return this.ingredientRepository.food(id);
  }
}
