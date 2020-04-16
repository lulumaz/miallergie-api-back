import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {UserIntolerance, Intolerance} from '../models';
import {UserIntoleranceRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class UserIntoleranceIntoleranceController {
  constructor(
    @repository(UserIntoleranceRepository)
    public userIntoleranceRepository: UserIntoleranceRepository,
  ) {}

  @get('/user-intolerances/{id}/intolerance', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Intolerance belonging to UserIntolerance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Intolerance)},
          },
        },
      },
    },
  })
  async getIntolerance(
    @param.path.string('id') id: typeof UserIntolerance.prototype.id,
  ): Promise<Intolerance> {
    return this.userIntoleranceRepository.intolerance(id);
  }
}
