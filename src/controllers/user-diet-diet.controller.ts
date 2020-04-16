import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {UserDiet, Diet} from '../models';
import {UserDietRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';

@authenticate('jwt')
export class UserDietDietController {
  constructor(
    @repository(UserDietRepository)
    public userDietRepository: UserDietRepository,
  ) {}

  @get('/user-diets/{id}/diet', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Diet belonging to UserDiet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Diet)},
          },
        },
      },
    },
  })
  async getDiet(
    @param.path.string('id') id: typeof UserDiet.prototype.id,
  ): Promise<Diet> {
    return this.userDietRepository.diet(id);
  }
}
