import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {FriendDiet, Diet} from '../models';
import {FriendDietRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';

@authenticate('jwt')
export class FriendDietDietController {
  constructor(
    @repository(FriendDietRepository)
    public friendDietRepository: FriendDietRepository,
  ) {}

  @get('/friend-diets/{id}/diet', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Diet belonging to FriendDiet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Diet)},
          },
        },
      },
    },
  })
  async getDiet(
    @param.path.string('id') id: typeof FriendDiet.prototype.id,
  ): Promise<Diet> {
    return this.friendDietRepository.diet(id);
  }
}
