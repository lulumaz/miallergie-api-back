import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Ingredient, Unit} from '../models';
import {IngredientRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';

@authenticate('jwt')
export class IngredientUnitController {
  constructor(
    @repository(IngredientRepository)
    public ingredientRepository: IngredientRepository,
  ) {}

  @get('/ingredients/{id}/unit', {
    security: OPERATION_SECURITY_SPEC,
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
