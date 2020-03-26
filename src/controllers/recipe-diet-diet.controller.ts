import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  RecipeDiet,
  Diet,
} from '../models';
import {RecipeDietRepository} from '../repositories';

export class RecipeDietDietController {
  constructor(
    @repository(RecipeDietRepository)
    public recipeDietRepository: RecipeDietRepository,
  ) { }

  @get('/recipe-diets/{id}/diet', {
    responses: {
      '200': {
        description: 'Diet belonging to RecipeDiet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Diet)},
          },
        },
      },
    },
  })
  async getDiet(
    @param.path.string('id') id: typeof RecipeDiet.prototype.id,
  ): Promise<Diet> {
    return this.recipeDietRepository.diet(id);
  }
}
