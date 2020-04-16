import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Ingredient, Food} from '../models';
import {IngredientRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';

@authenticate('jwt')
export class IngredientFoodController {
  constructor(
    @repository(IngredientRepository)
    public ingredientRepository: IngredientRepository,
  ) {}

  @get('/ingredients/{id}/food', {
    security: OPERATION_SECURITY_SPEC,
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
