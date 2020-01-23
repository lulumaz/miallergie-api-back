import {
  AuthenticationStrategy,
  AuthenticationBindings,
} from '@loopback/authentication';
import {inject, Provider, ValueOrPromise} from '@loopback/core';
import {MyAuthenticationMetadata, SecuredType} from './MyAuthMetadataProvider';
import {UserRepository, UserRoleRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {UserProfile, securityId} from '@loopback/security';
import {HttpErrors} from '@loopback/rest';
import {Strategy /* jwtstrategy*/, ExtractJwt} from 'passport-jwt';
import {StrategyAdapter} from '@loopback/authentication-passport';
const config = require('../config');

//config
export const JWT_STRATEGY_NAME = 'jwt';
// the JWT_secret to encrypt and decrypt JWT token
export const JWT_SECRET = config.auth.secretToken;
// the required interface to filter login payload
export interface Credentials {
  email: string;
  username: string;
  password: string;
}

export class MyAuthAuthenticationStrategyProvider
  implements Provider<AuthenticationStrategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: MyAuthenticationMetadata,
    @repository(UserRepository) private userRepository: UserRepository,
    @repository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
  ) {}

  value(): ValueOrPromise<AuthenticationStrategy | undefined> {
    if (!this.metadata) return;

    const {strategy} = this.metadata;
    if (strategy === JWT_STRATEGY_NAME) {
      const jwtStrategy: Strategy = new Strategy( //jwtStrategy
        {
          secretOrKey: JWT_SECRET,
          jwtFromRequest: ExtractJwt.fromExtractors([
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            ExtractJwt.fromUrlQueryParameter('access_token'),
          ]),
        },
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        (payload, done) => this.verifyToken(payload, done),
      );

      // we will use Loopback's  StrategyAdapter so we can leverage passport's strategy
      // and also we don't have to implement a new strategy adapter.
      return new StrategyAdapter(jwtStrategy, JWT_STRATEGY_NAME);
    }
  }

  // verify JWT token and decryot the payload.
  // Then search user from database with id equals to payload's email.
  // if user is found, then verify its roles
  async verifyToken(
    payload: Credentials,
    done: (
      err: Error | null,
      user?: UserProfile | false,
      info?: Object,
    ) => void,
  ) {
    try {
      const {email, username} = payload;
      const user = await this.userRepository.findOne({where: {email: email}});
      if (!user) done(null, false);

      await this.verifyRoles(username, email);

      //TODO: verif if name as email is ok
      done(null, {name: email, email: user?.email, [securityId]: email});
    } catch (err) {
      if (err.name === 'UnauthorizedError') done(null, false);
      done(err, false);
    }
  }

  // verify user's role based on the SecuredType
  async verifyRoles(username: string, email: string) {
    const {type, roles} = this.metadata;

    if ([SecuredType.IS_AUTHENTICATED, SecuredType.PERMIT_ALL].includes(type))
      return;

    if (type === SecuredType.HAS_ROLES && roles.length) {
      const user = await this.userRepository.findOne({
        where: {
          email: email,
          username: username,
        },
      });
      const userRoles = await this.userRoleRepository.find(
        {
          where: {userId: user?.id},
        },
        {strictObjectIDCoercion: true},
      );
      const roleIds = userRoles.map(ur => ur.roleId);
      let valid = true;
      for (const role of roles)
        if (!roleIds.includes(role)) {
          valid = false;
          break;
        }

      if (valid) return;
    }
    throw new HttpErrors.Unauthorized('Invalid authorization');
  }
}
