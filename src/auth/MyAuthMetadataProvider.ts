import {
  CoreBindings,
  inject,
  Constructor,
  MetadataInspector,
  MethodDecoratorFactory,
} from '@loopback/core';
import {AuthMetadataProvider} from '@loopback/authentication/dist/providers/auth-metadata.provider';
import {AuthenticationMetadata} from '@loopback/authentication/dist/types';
import {AUTHENTICATION_METADATA_KEY} from '@loopback/authentication';

// the decorator function, every required param has its own default
// so we can supply empty param when calling this decorartor.
// we will use 'secured' to match Spring Security annotation.
export function secured(
  type: SecuredType = SecuredType.IS_AUTHENTICATED, // more on this below
  roles: string[] = [],
  strategy = 'jwt',
  options?: object,
) {
  // we will use a custom interface. more on this below
  return MethodDecoratorFactory.createDecorator<MyAuthenticationMetadata>(
    AUTHENTICATION_METADATA_KEY,
    {
      type,
      roles,
      strategy,
      options,
    },
  );
}
// enum for available secured type,
export enum SecuredType {
  IS_AUTHENTICATED, // any authenticated user
  PERMIT_ALL, // bypass security check, permit everyone
  HAS_ROLES, // user mast have all roles specified in the `roles` attribute
  IS_OWNER, //allow only the user that create the ressource and the administrators
  DENY_ALL, // you shall not pass!
}

// extended interface of the default AuthenticationMetadata which only has `strategy` and `options`
export interface MyAuthenticationMetadata extends AuthenticationMetadata {
  type: SecuredType;
  roles: string[];
}
// metadata provider for `MyAuthenticationMetadata`. Will supply method's metadata when injected
export class MyAuthMetadataProvider extends AuthMetadataProvider {
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS, {optional: true})
    protected _controllerClass: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME, {optional: true})
    protected _methodName: string,
  ) {
    super(_controllerClass, _methodName);
  }

  value(): MyAuthenticationMetadata | undefined {
    if (!this._controllerClass || !this._methodName) return;
    return MetadataInspector.getMethodMetadata<MyAuthenticationMetadata>(
      AUTHENTICATION_METADATA_KEY,
      this._controllerClass.prototype,
      this._methodName,
    );
  }
}
