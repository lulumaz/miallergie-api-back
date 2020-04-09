import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  FriendAllergy,
  Allergy,
} from '../models';
import {FriendAllergyRepository} from '../repositories';

export class FriendAllergyAllergyController {
  constructor(
    @repository(FriendAllergyRepository)
    public friendAllergyRepository: FriendAllergyRepository,
  ) { }

  @get('/friend-allergies/{id}/allergy', {
    responses: {
      '200': {
        description: 'Allergy belonging to FriendAllergy',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Allergy)},
          },
        },
      },
    },
  })
  async getAllergy(
    @param.path.string('id') id: typeof FriendAllergy.prototype.id,
  ): Promise<Allergy> {
    return this.friendAllergyRepository.allergy(id);
  }
}
