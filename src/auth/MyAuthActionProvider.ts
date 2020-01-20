import {inject, Provider, Getter, Setter, BindingKey} from '@loopback/core';
import {
  AuthenticateFn,
  AuthenticationBindings,
  AuthenticationStrategy,
} from '@loopback/authentication';
import {MyAuthenticationMetadata, SecuredType} from './MyAuthMetadataProvider';
import {UserProfile} from '@loopback/security';
import {Request} from '@loopback/rest';

// implement custom namespace bindings
export namespace MyAuthBindings {
  export const STRATEGY = BindingKey.create<AuthenticationStrategy | undefined>(
    'authentication.strategy',
  );
}

export class MyAuthActionProvider implements Provider<AuthenticateFn> {
  constructor(
    @inject.getter(MyAuthBindings.STRATEGY)
    readonly getStrategy: Getter<AuthenticationStrategy>,
    @inject.setter(AuthenticationBindings.CURRENT_USER)
    readonly setCurrentUser: Setter<UserProfile>,
    @inject.getter(AuthenticationBindings.METADATA)
    readonly getMetadata: Getter<MyAuthenticationMetadata>,
  ) {}

  value(): AuthenticateFn {
    return request => this.action(request);
  }

  async action(request: Request): Promise<UserProfile | undefined> {
    const metadata = await this.getMetadata();
    if (metadata && metadata.type === SecuredType.PERMIT_ALL) return;

    const strategy = await this.getStrategy();
    if (!strategy) return;

    const user = await strategy.authenticate(request);
    if (!user) return;

    this.setCurrentUser(user);
    return user;
  }
}
