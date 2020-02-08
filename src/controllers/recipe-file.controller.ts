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
  File,
} from '../models';
import {RecipeRepository} from '../repositories';

export class RecipeFileController {
  constructor(
    @repository(RecipeRepository) protected recipeRepository: RecipeRepository,
  ) { }

  @get('/recipes/{id}/file', {
    responses: {
      '200': {
        description: 'Recipe has one File',
        content: {
          'application/json': {
            schema: getModelSchemaRef(File),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<File>,
  ): Promise<File> {
    return this.recipeRepository.file(id).get(filter);
  }

  @post('/recipes/{id}/file', {
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {'application/json': {schema: getModelSchemaRef(File)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Recipe.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(File, {
            title: 'NewFileInRecipe',
            exclude: ['id'],
            optional: ['recipeId']
          }),
        },
      },
    }) file: Omit<File, 'id'>,
  ): Promise<File> {
    return this.recipeRepository.file(id).create(file);
  }

  @patch('/recipes/{id}/file', {
    responses: {
      '200': {
        description: 'Recipe.File PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(File, {partial: true}),
        },
      },
    })
    file: Partial<File>,
    @param.query.object('where', getWhereSchemaFor(File)) where?: Where<File>,
  ): Promise<Count> {
    return this.recipeRepository.file(id).patch(file, where);
  }

  @del('/recipes/{id}/file', {
    responses: {
      '200': {
        description: 'Recipe.File DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(File)) where?: Where<File>,
  ): Promise<Count> {
    return this.recipeRepository.file(id).delete(where);
  }
}
