# Auth Cloud WebAuthn SDK

[![CI](https://github.com/lighthauz/auth-cloud-webauthn-sdk/actions/workflows/ci-tester.yml/badge.svg)](https://github.com/lighthauz/auth-cloud-webauthn-sdk/actions/workflows/ci-tester.yml)

# Introduction

## Tenant Creation

To use this SDK, Trusona must create a `tenant` within our infrastructure for your domain.

Contact us about that.

You can verify that a tenant exists and is configured if you visit `https://<YOUR-TENANT-ORIGIN-DOMAIN>/configuration`

## JWKS Endpoint

Within your infrastructure, an endpoint must be implemented to provide public keys' information in a [JWKS format](https://www.rfc-editor.org/rfc/rfc7517).

You will provide this endpoint to us as part of of tenant configuration.

Our APIs expect this to be available and will verify the validity of provided tokens against this endpoint.

Any failure of this check, will fail the corresponding SDK call.


# SDK Usage

## Installation

Install the SDK into your application or library with [NPM](https://docs.npmjs.com/cli/v8/commands/npm-install).

```bash
npm install @trusona/webauthn
```

If you use yarn as your package manager, you may do so with [yarn](https://classic.yarnpkg.com/lang/en/docs/cli/install/)

```bash
yarn install @trusona/webauthn
```

## Initialization

Add a reference to the library within your implementation.

> The provided snippets below are in [typescript](https://www.typescriptlang.org)


```typescript
import * as trusona from '@trusona/webauthn'
```

In a constructor or some early logic, initialize the SDK.

This should only be done once.

```typescript
trusona.Initializer.initialize('https://<YOUR-TENANT-ORIGIN-DOMAIN>')
  .then((_) => {
    // your happy path code
  })
  .catch((error) => {
    // your error handling code
  })
```  

## Enroll Your Users

To enroll a user, from within your backend, generate a JWT token with the `subject` claim as a user's identifier or username.

This identifier does not need to be an email address, but it should uniquely identify the user and they should be able to recognize it.

Once generated, invoke the `enroll(string)` method.

```typescript
const jwt:string = 'jwt.token-with-subject-claim.signature' // generated from your backend

new trusona.WebAuthnEnrollment().enroll(jwt)
  .then((status) => {
    // your happy path code after enrollment .. the user is now enrolled
  })
  .catch((error) => {
    // your error handling code ... enrollment failed
    // examine the provided error for details
  })
```

## Authenticate Your Users

To authenticate a user, you can provide a username hint to the SDK or not.

On success, a JWT is going to be provided in the SDK response that you can examine and verify the identity of the user.

> The `subject` claim in the provided JWT will match `subject` that was provided during enrollment. 

```typescript
const usernameHint:string = 'hint .. not required' // optional parameter

new trusona.WebAuthnAuthentication().authenticate()
  .then((map) => {
    const authToken:string = map.token // JWT from Trusona
    const jwksEndpoint:string = trusona.Initializer.jwksEndpoint()
    //
    // Verify the JWT against the Trusona's JWKS implementation endpoint.
    //
    // A "subject" claim will have the username of the authenticated user.
    //
  })
  .catch((error) => {
    // your error handling code ... authentication failed
    // examine the provided error for details
  })
```
