import {OPERATION_SECURITY_SPEC} from './../auth/security-spec';
import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {RecipeDiet, Diet} from '../models';
import {RecipeDietRepository} from '../repositories';

@authenticate('jwt')
export class RecipeDietDietController {
  constructor(
    @repository(RecipeDietRepository)
    public recipeDietRepository: RecipeDietRepository,
  ) {}

  @get('/recipe-diets/{id}/diet', {
    security: OPERATION_SECURITY_SPEC,
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
