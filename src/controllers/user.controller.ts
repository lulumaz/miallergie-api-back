import {RegisteredFriendWithRelations} from './../models/registered-friend.model';
import {IntoleranceRepository} from './../repositories/intolerance.repository';
import {AllergyRepository} from './../repositories/allergy.repository';
import {DietRepository} from './../repositories/diet.repository';
import {FriendWithRelations} from './../models/friend.model';
import {FriendRepository} from './../repositories/friend.repository';
import {UserIntoleranceRepository} from './../repositories/user-intolerance.repository';
import {UserAllergyRepository} from './../repositories/user-allergy.repository';
import {UserIntoleranceWithRelations} from './../models/user-intolerance.model';
import {UserAllergyWithRelations} from './../models/user-allergy.model';
import {UserDietRepository} from './../repositories/user-diet.repository';
import {UserDietWithRelations} from './../models/user-diet.model';
import {NotFound} from './../utils/error';
import {UserWithRole} from './../services/user-service';
import {Credentials, UserWithRelations} from './../models/user.model';
import {PasswordHasher} from './../services/hash';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {
  TokenService,
  UserService,
  authenticate,
} from '@loopback/authentication';
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
  RestBindings,
  Response,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository, UserRoleRepository} from '../repositories';
import {
  validateRegister,
  validateUsername,
  validateEmail,
  validatePassword,
} from '../utils/validator';
import {inject} from '@loopback/core';
import {property, Entity, model} from '@loopback/repository';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../auth/keys';

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
      uniqueUser: {
        keys: {
          username: 1,
        },
        options: {
          unique: true,
        },
      },
    },
    hiddenProperties: ['password'],
  },
})
class UserChangePassword extends Entity {
  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  username: string;

  @property({
    type: 'string',
  })
  oldPassword: string;

  @property({
    type: 'string',
  })
  newPassword: string;

  constructor(data?: Partial<UserChangePassword>) {
    super(data);
  }
}
@model({})
class UserLogin extends Entity {
  @property({
    type: 'string',
  })
  email: string;
  @property({
    type: 'string',
  })
  password: string;

  constructor(data?: Partial<UserLogin>) {
    super(data);
  }
}

export class UserController {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @repository(DietRepository) private dietRepository: DietRepository,
    @repository(AllergyRepository)
    private allergyRepository: AllergyRepository,
    @repository(IntoleranceRepository)
    private intoleranceRepository: IntoleranceRepository,
    @repository(UserDietRepository)
    private userDietRepository: UserDietRepository,
    @repository(UserIntoleranceRepository)
    private userIntoleranceRepository: UserIntoleranceRepository,
    @repository(UserAllergyRepository)
    private userAllergyRepository: UserAllergyRepository,
    @repository(FriendRepository)
    private friendRepository: FriendRepository,
    @repository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) {}

  @post('/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
      '530': {
        description: 'Error when validating data',
        content: {'application/json': {}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id', 'createAt'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    //validate with Joi
    const {error} = validateRegister(user);
    if (error) {
      throw new NotFound(530, error.details[0].message);
    }

    //Hash the password
    const hashedPassword = await this.passwordHasher.hashPassword(
      user.password,
    );
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

  @get('/users/count', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(User))
    where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
      '530': {
        description: 'Error when validating data',
        content: {'application/json': {}},
      },
      '531': {
        description: 'User with the same username already exist',
        content: {'application/json': {}},
      },
      '532': {
        description: 'User with the same email already exist',
        content: {'application/json': {}},
      },
      '533': {
        description: 'The old password with different',
        content: {'application/json': {}},
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserChangePassword, {
            title: 'changeUser',
          }),
        },
      },
    })
    user: Omit<UserChangePassword, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    const newUser: User = await this.userRepository.findById(id); //getting actual user

    if (user.username) {
      if (
        (await this.userRepository.count({username: user.username})).count === 0
      ) {
        newUser.username = user.username;

        //validating new user
        const {error} = validateUsername({username: user.username});
        if (error) {
          throw new NotFound(530, error.details[0].message);
        }

        await this.userRepository.replaceById(newUser.id, newUser);
      } else {
        throw new NotFound(531, 'Un utilisateur avec le même nom existe déjà.');
      }
    }

    if (user.email) {
      if ((await this.userRepository.count({email: user.email})).count === 0) {
        newUser.email = user.email;

        //validating new user
        const {error} = validateEmail({email: user.email});
        if (error) {
          throw new NotFound(530, error.details[0].message);
        }

        await this.userRepository.replaceById(newUser.id, newUser);
      } else {
        throw new NotFound(
          532,
          'Un utilisateur avec la même adresse mail existe déjà.',
        );
      }
    }

    if (user.newPassword && user.oldPassword) {
      /*const isPasswordMatched = await bcrypt.compare(
        user.oldPassword,
        newUser.password,
      );*/
      const test = await this.userService.verifyCredentials({
        email: user.email,
        password: user.oldPassword,
        id: id,
      });

      if (test) {
        //validating new user
        newUser.password = user.newPassword;
        const {error} = validatePassword({password: user.newPassword});
        if (error) {
          throw new NotFound(530, error.details[0].message);
        }

        //Hash the password
        const hashedPassword = await this.passwordHasher.hashPassword(
          newUser.password,
        );
        newUser.password = hashedPassword;
        await this.userRepository.replaceById(newUser.id, newUser);
      } else {
        throw new NotFound(533, "L'ancien mot de passe n'est pas le bon");
      }
    }
  }

  @del('/users/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  @authenticate('jwt')
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
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserLogin, {
            title: 'user',
          }),
        },
      },
    })
    credentials: Credentials,
  ) {
    if (!credentials.email || !credentials.password)
      throw new HttpErrors.BadRequest('Missing email or Password');

    const user = await this.userService.verifyCredentials(credentials);

    const roles = await this.userRoleRepository.find(
      {
        where: {userId: user.id},
      },
      {strictObjectIDCoercion: true},
    );
    const {id, email, username} = user;

    const userWithRole: UserWithRole = new UserWithRole(user);
    userWithRole.roles = roles;

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(userWithRole);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {
      token,
      id: id as string,
      username,
      email,
      roles: roles.map((r) => r.roleId),
    };
  }

  @get('/users/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: {
      id: string;
      name: string;
      roles: string[];
    },
  ): Promise<any> {
    const user = await this.userRepository.findById(currentUserProfile.id);

    await this.findDiets(user);
    await this.findAllergies(user);
    await this.findIntolerances(user);

    user.nonRegisteredFriends = await this.userRepository
      .nonRegisteredFriends(user.id)
      .find(
        {
          fields: {
            surname: true,
            userId: true,
            id: true,
            diets: true,
          },
          include: [{relation: 'diets'}],
        },
        {strictObjectIDCoercion: true},
      );
    const nonRegisteredFriends: FriendWithRelations[] =
      user.nonRegisteredFriends;

    for (const nonRegisteredFriend of nonRegisteredFriends) {
      await this.findDiets(nonRegisteredFriend);
      await this.findAllergies(nonRegisteredFriend);
      await this.findIntolerances(nonRegisteredFriend);
    }

    user.registeredFriends = await this.userRepository
      .registeredFriends(user.id)
      .find({fields: {friendUserId: true}}, {strictObjectIDCoercion: true});
    const registeredFriends: RegisteredFriendWithRelations[] =
      user.registeredFriends;
    for (const registeredFriend of registeredFriends) {
      const friend: UserWithRelations = await this.userRepository.findById(
        registeredFriend.friendUserId,
      );
      await this.findDiets(friend);
      await this.findAllergies(friend);
      await this.findIntolerances(friend);
      registeredFriend.friendUser = friend;
    }

    return user;
  }

  private async findDiets(user: UserWithRelations | FriendWithRelations) {
    if (user instanceof User) {
      user.diets = await this.userRepository.diets(user.id).find(
        {
          fields: {
            dietId: true,
          },
          include: [{relation: 'diet'}],
        },
        {strictObjectIDCoercion: true},
      );
    } else {
      user.diets = await this.friendRepository.diets(user.id).find(
        {
          fields: {
            dietId: true,
          },
          include: [{relation: 'diet'}],
        },
        {strictObjectIDCoercion: true},
      );
    }

    const diets: UserDietWithRelations[] = user.diets;
    for (const diet of diets) {
      console.log(diet.dietId);
      diet.diet = await this.dietRepository.findById(diet.dietId);
    }
  }

  private async findAllergies(user: UserWithRelations | FriendWithRelations) {
    if (user instanceof User) {
      user.allergies = await this.userRepository.allergies(user.id).find(
        {
          fields: {
            allergyId: true,
          },
          include: [{relation: 'allergy'}],
        },
        {strictObjectIDCoercion: true},
      );
    } else {
      user.allergies = await this.friendRepository.allergies(user.id).find(
        {
          fields: {
            allergyId: true,
          },
          include: [{relation: 'allergy'}],
        },
        {strictObjectIDCoercion: true},
      );
    }
    const allergies: UserAllergyWithRelations[] = user.allergies;
    for (const allergy of allergies) {
      console.log(allergy.allergyId);

      allergy.allergy = await this.allergyRepository.findById(
        allergy.allergyId,
      );
    }
  }

  private async findIntolerances(
    user: UserWithRelations | FriendWithRelations,
  ) {
    if (user instanceof User) {
      user.intolerances = await this.userRepository.intolerances(user.id).find(
        {
          fields: {
            intoleranceId: true,
          },
          include: [{relation: 'intolerance'}],
        },
        {strictObjectIDCoercion: true},
      );
    } else {
      user.intolerances = await this.friendRepository
        .intolerances(user.id)
        .find(
          {
            fields: {
              intoleranceId: true,
            },
            include: [{relation: 'intolerance'}],
          },
          {strictObjectIDCoercion: true},
        );
    }

    const intolerances: UserIntoleranceWithRelations[] = user.intolerances;
    for (const intolerance of intolerances) {
      console.log(intolerance.intoleranceId);

      intolerance.intolerance = await this.intoleranceRepository.findById(
        intolerance.intoleranceId,
      );
    }
  }
}
