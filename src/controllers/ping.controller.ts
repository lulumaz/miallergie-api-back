import {OPERATION_SECURITY_SPEC} from './../auth/security-spec';
import {Request, RestBindings, get, ResponseObject} from '@loopback/rest';
import {inject} from '@loopback/context';
import {SecuredType, secured} from '../auth/MyAuthMetadataProvider';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  // test endpoints here

  @get('/ping/is-authenticated', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'ping is ok',
      },
    },
  })
  @secured(SecuredType.IS_AUTHENTICATED)
  testIsAuthenticated() {
    return {message: 'isAuthenticated: OK'};
  }

  @get('/ping/permit-all', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'ping is ok',
      },
    },
  })
  @secured(SecuredType.PERMIT_ALL)
  testPermitAll() {
    return {message: 'permitAll: OK'};
  }

  @get('/ping/deny-all', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'no one can use this',
      },
    },
  })
  @secured(SecuredType.DENY_ALL)
  testDenyAll() {
    return {message: 'denyAll: OK'};
  }

  @get('/ping/has-any-role', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'ping is ok if user has role',
      },
    },
  })
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN'])
  testHasAnyRole() {
    return {message: 'hasAnyRole: OK'};
  }

  @get('/ping/has-roles', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'ping is ok if user is ADMIN',
      },
    },
  })
  @secured(SecuredType.HAS_ROLES, ['ADMIN'])
  testHasRoles() {
    return {message: 'hasRoles: OK'};
  }
}
