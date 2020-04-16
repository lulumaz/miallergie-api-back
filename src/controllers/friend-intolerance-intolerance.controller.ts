import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {FriendIntolerance, Intolerance} from '../models';
import {FriendIntoleranceRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from '../auth/security-spec';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class FriendIntoleranceIntoleranceController {
  constructor(
    @repository(FriendIntoleranceRepository)
    public friendIntoleranceRepository: FriendIntoleranceRepository,
  ) {}

  @get('/friend-intolerances/{id}/intolerance', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Intolerance belonging to FriendIntolerance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Intolerance)},
          },
        },
      },
    },
  })
  async getIntolerance(
    @param.path.string('id') id: typeof FriendIntolerance.prototype.id,
  ): Promise<Intolerance> {
    return this.friendIntoleranceRepository.intolerance(id);
  }
}
