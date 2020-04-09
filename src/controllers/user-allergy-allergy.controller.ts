import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserAllergy,
  Allergy,
} from '../models';
import {UserAllergyRepository} from '../repositories';

export class UserAllergyAllergyController {
  constructor(
    @repository(UserAllergyRepository)
    public userAllergyRepository: UserAllergyRepository,
  ) { }

  @get('/user-allergies/{id}/allergy', {
    responses: {
      '200': {
        description: 'Allergy belonging to UserAllergy',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Allergy)},
          },
        },
      },
    },
  })
  async getAllergy(
    @param.path.string('id') id: typeof UserAllergy.prototype.id,
  ): Promise<Allergy> {
    return this.userAllergyRepository.allergy(id);
  }
}
