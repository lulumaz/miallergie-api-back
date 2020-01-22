import {SecuredType} from './../auth/MyAuthMetadataProvider';
import {OPERATION_SECURITY_SPEC} from './../auth/security-spec';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository, UserRoleRepository} from '../repositories';
import {promisify} from 'util';
import {
  Credentials,
  JWT_SECRET,
} from '../auth/MyAuthAuthenticationStrategyProvider';
import {secured} from '../auth/MyAuthMetadataProvider';
const bcrypt = require('bcrypt');

const {sign} = require('jsonwebtoken');
const signAsync = promisify(sign);

export class UserController {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @repository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
  ) {}

  @post('/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    const prom: Promise<User> = this.userRepository.create(user);
    prom
      .then((savedUser: User) => {
        this.userRoleRepository
          .create({
            roleId: 'Classic',
            userId: savedUser.id,
          })
          .catch((err: any) => {
            console.error(
              "Erreur lors de l'ajout d'un nouvel utilisateur au role Classic",
              err,
            );
          });
      })
      .catch((err: any) => {
        console.error("Erreur lors de l'ajout d'un nouvel utilisateur", err);
      });
    return prom;
  }

  @secured(SecuredType.HAS_ROLES, ['Admin'])
  @get('/users/count', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(User))
    where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @secured(SecuredType.HAS_ROLES, ['Admin'])
  @get('/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(User))
    filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.query.object('where', getWhereSchemaFor(User))
    where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(User))
    filter?: Filter<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @secured(SecuredType.HAS_ROLES, ['Admin'])
  @del('/users/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
  //-------------------- custom --------------------
  @post('/users/login', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User LOGIN success',
      },
    },
  })
  async login(@requestBody() credentials: Credentials) {
    if (!credentials.email || !credentials.password)
      throw new HttpErrors.BadRequest('Missing email or Password');
    const user = await this.userRepository.findOne({
      where: {email: credentials.email},
    });
    if (!user) throw new HttpErrors.Unauthorized('Invalid credentials');

    console.log({base: user.password, req: credentials.password});

    const isPasswordMatched = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordMatched)
      throw new HttpErrors.Unauthorized('Invalid credentials');

    const tokenObject = {email: credentials.email};
    const token = await signAsync(tokenObject, JWT_SECRET);
    const roles = await this.userRoleRepository.find({
      where: {userId: user.id},
    });
    const {id, email} = user;

    return {
      token,
      id: id as string,
      email,
      roles: roles.map(r => r.roleId),
    };
  }
}
