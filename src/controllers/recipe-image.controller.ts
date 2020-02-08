import {FileRepository} from './../repositories/file.repository';
import {File} from './../models/file.model';
import {Recipe} from './../models/recipe.model';
import {repository} from '@loopback/repository';
import {RecipeRepository} from './../repositories/recipe.repository';
import {inject} from '@loopback/core';
import {
  post,
  requestBody,
  param,
  Request,
  RestBindings,
  Response,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import multer = require('multer');

const storage = multer.diskStorage({
  destination: function(_req, _file, cb) {
    cb(null, './storage/');
  },
});
const configMulter = {
  storage: storage,
  fileFilter: function(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _req: any,
    file: {originalname: string},
    callback: (arg0: Error | null, arg1?: boolean) => void,
  ) {
    const ext = file.originalname.split('.').pop();
    if (ext !== 'png' && ext !== 'jpg' && ext !== 'gif' && ext !== 'jpeg') {
      return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
};

export class RecipeImageController {
  constructor(
    @repository(RecipeRepository)
    public recipeRepository: RecipeRepository,
    @repository(FileRepository)
    public fileRepository: FileRepository,
  ) {}

  @get('/recipes/{id}/image', {
    responses: {
      '200': {
        description: 'File belonging to Recipe',
        content: {
          'application/json': {
            schema: getModelSchemaRef(File),
          },
        },
      },
    },
  })
  async getFile(
    @param.path.string('id') id: typeof Recipe.prototype.id,
  ): Promise<File> {
    return this.recipeRepository.image(id);
  }

  @post('/recipes/{id}/uploadImage')
  async create(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) _response: Response,
  ): Promise<File> {
    const recipe: Recipe = await this.recipeRepository.findById(id);

    return new Promise<File>((resolve, reject) => {
      const upload = multer(configMulter);
      upload.single(id)(request, {} as any, async err => {
        if (err) {
          console.error(err);
          return reject(err.message);
        }
        if (recipe.imageId !== undefined) {
          await this.fileRepository.deleteById(recipe.imageId);
        }

        const file: File = await this.fileRepository.create({
          path: 'storage/' + request.file.filename,
          name: request.file.originalname,
          type: request.file.mimetype,
        });
        recipe.imageId = file.id ? file.id : '';
        await this.recipeRepository.update(recipe);
        //this.fileRepository.create({})
        resolve(file);
      });
    });
  }
}
