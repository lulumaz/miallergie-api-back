import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Recipe, User} from '../models';
import {RecipeRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';

@authenticate('jwt')
export class RecipeUserController {
  constructor(
    @repository(RecipeRepository)
    public recipeRepository: RecipeRepository,
  ) {}

  @get('/recipes/{id}/user', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User belonging to Recipe',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Recipe.prototype.id,
  ): Promise<User> {
    return this.recipeRepository.ownerUser(id);
  }
}
