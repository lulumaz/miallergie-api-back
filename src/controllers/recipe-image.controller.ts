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
  ) {}

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
  ): Promise<Object> {
    await this.recipeRepository.findById(id);

    return new Promise<object>((resolve, reject) => {
      try {
        const upload = multer(configMulter);
        upload.single(id)(request, {} as any, err => {
          if (err) {
            console.error(err);
            return reject(err.message);
          }
          resolve({
            value: {
              files: request.files,
              fields: (request as any).fields,
            },
          });
        });
      } catch (error) {
        console.error(error);
      }
    });
  }
}
