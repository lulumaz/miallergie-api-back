import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Recipe,
  Allergy,
} from '../models';
import {RecipeRepository} from '../repositories';

export class RecipeAllergyController {
  constructor(
    @repository(RecipeRepository) protected recipeRepository: RecipeRepository,
  ) { }

  @get('/recipes/{id}/allergies', {
    responses: {
      '200': {
        description: 'Array of Allergy\'s belonging to Recipe',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Allergy)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Allergy>,
  ): Promise<Allergy[]> {
    return this.recipeRepository.allergies(id).find(filter);
  }

  @post('/recipes/{id}/allergies', {
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {'application/json': {schema: getModelSchemaRef(Allergy)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Recipe.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Allergy, {
            title: 'NewAllergyInRecipe',
            exclude: ['id'],
            optional: ['recipeId']
          }),
        },
      },
    }) allergy: Omit<Allergy, 'id'>,
  ): Promise<Allergy> {
    return this.recipeRepository.allergies(id).create(allergy);
  }

  @patch('/recipes/{id}/allergies', {
    responses: {
      '200': {
        description: 'Recipe.Allergy PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Allergy, {partial: true}),
        },
      },
    })
    allergy: Partial<Allergy>,
    @param.query.object('where', getWhereSchemaFor(Allergy)) where?: Where<Allergy>,
  ): Promise<Count> {
    return this.recipeRepository.allergies(id).patch(allergy, where);
  }

  @del('/recipes/{id}/allergies', {
    responses: {
      '200': {
        description: 'Recipe.Allergy DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Allergy)) where?: Where<Allergy>,
  ): Promise<Count> {
    return this.recipeRepository.allergies(id).delete(where);
  }
}
