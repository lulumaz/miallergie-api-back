import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Ingredient, Unit} from '../models';
import {IngredientRepository} from '../repositories';

export class IngredientUnitController {
  constructor(
    @repository(IngredientRepository)
    public ingredientRepository: IngredientRepository,
  ) {}

  @get('/ingredients/{id}/unit', {
    responses: {
      '200': {
        description: 'Unit belonging to Ingredient',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Unit)},
          },
        },
      },
    },
  })
  async getUnit(
    @param.path.string('id') id: typeof Ingredient.prototype.id,
  ): Promise<Unit> {
    return this.ingredientRepository.unitRelation(id);
  }
}
