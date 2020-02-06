import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Recipe,
  Diet,
} from '../models';
import {RecipeRepository} from '../repositories';

export class RecipeDietController {
  constructor(
    @repository(RecipeRepository)
    public recipeRepository: RecipeRepository,
  ) { }

  @get('/recipes/{id}/diet', {
    responses: {
      '200': {
        description: 'Diet belonging to Recipe',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Diet)},
          },
        },
      },
    },
  })
  async getDiet(
    @param.path.string('id') id: typeof Recipe.prototype.id,
  ): Promise<Diet> {
    return this.recipeRepository.diet(id);
  }
}
