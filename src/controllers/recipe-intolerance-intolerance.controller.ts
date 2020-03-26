import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {RecipeIntolerance, Intolerance} from '../models';
import {RecipeIntoleranceRepository} from '../repositories';

@authenticate('jwt')
export class RecipeIntoleranceIntoleranceController {
  constructor(
    @repository(RecipeIntoleranceRepository)
    public recipeIntoleranceRepository: RecipeIntoleranceRepository,
  ) {}

  @get('/recipe-intolerances/{id}/intolerance', {
    responses: {
      '200': {
        description: 'Intolerance belonging to RecipeIntolerance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Intolerance)},
          },
        },
      },
    },
  })
  async getIntolerance(
    @param.path.string('id') id: typeof RecipeIntolerance.prototype.id,
  ): Promise<Intolerance> {
    return this.recipeIntoleranceRepository.intolerance(id);
  }
}
