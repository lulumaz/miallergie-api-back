import {OPERATION_SECURITY_SPEC} from './../auth/security-spec';
import {Request, RestBindings, get, ResponseObject} from '@loopback/rest';
import {inject} from '@loopback/context';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/authorizor';

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
  @authenticate('jwt')
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
  @authenticate('jwt')
  @authorize({
    allowedRoles: [],
    voters: [basicAuthorization],
  })
  testDenyAll() {
    return {message: 'denyAll: OK'};
  }

  @get('/ping/has-admin-role', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'ping is ok if user is ADMIN',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['Admin'],
    voters: [basicAuthorization],
  })
  testHasRoles() {
    return {message: 'hasRoles: OK'};
  }
}
