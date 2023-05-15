# Trusona AuthCloud WebAuthn SDK

[![.github/workflows/ci-tester.yml](https://github.com/trusona/auth-cloud-webauthn-sdk/actions/workflows/ci-tester.yml/badge.svg)](https://github.com/trusona/auth-cloud-webauthn-sdk/actions/workflows/ci-tester.yml)

# Introduction

## Tenant Creation

To use this SDK, Trusona must create a `tenant` within our infrastructure for your domain.

Contact us about that at [support@trusona.com](mailto:support@trusona.com)

As part of this step, Trusona shall provide you with access to a portal where you can find your unique `tenantId` that would be used to initialize the SDK.

## JWKS Endpoint

Within your infrastructure, an URL endpoint must be implemented to provide public keys' information in a [JWKS format](https://www.rfc-editor.org/rfc/rfc7517).

You will provide this endpoint to us as part of of tenant configuration via the portal.

Our APIs expect this to be available and will verify the validity of provided tokens against this endpoint.

Any failure of this check, will fail the corresponding SDK call.


# SDK Usage

## Installation

Install the SDK into your application or library with [npm](https://docs.npmjs.com/cli/v8/commands/npm-install).

```bash
npm install @trusona/webauthn
```

If you use [yarn](https://classic.yarnpkg.com/lang/en/docs/cli/install/) as your package manager, you can install it similarly:

```bash
yarn install @trusona/webauthn
```

## Declaration

Add a reference to the library within your implementation.

> The provided snippets below are in [typescript](https://www.typescriptlang.org)

```typescript
import * as trusona from '@trusona/webauthn'
```

## Preflight

It is prudent to perform some preflight checks before you initialize the SDK to ensure your users have a compatible browser.

This can be accomplished with a static method that returns `true` or `false` indicating whether the user can successfully complete enrollment and authentication on their current browser.

```typescript

const supported:boolean = await trusona.DefaultPreflightChecks.supported()

if (supported) {
  // this browser can complete all the implemented WebAuthn capabilities. Ok to proceed
  //
} else {
  //
  // Current user or browser is not supported. Let them know. 
  //
  // Gently guide them to a better browser :)
  //
}
```

## Initialization

Next, in a constructor or other early first-run logic, initialize the SDK.

This should only be done once.

```typescript

// not a secret; but is unique to the tenant; contact Trusona for your own value.
const tenantId = '00000000-0000-0000-4000-000000000000'

trusona.Initializer.initialize(tenantId)
  .then((_) => {
    // successfully initialized; your happy path code
  })
  .catch((error) => {
    // failed initialization! Is the tenant ID correct? Your error handling code
  })
```  

## Enroll Your Users

To enroll a user, from within your backend, generate a `JWT` token with the `subject` claim as a user's identifier or username.

This identifier does not need to be an email address, but it should uniquely identify the user and they should be able to recognize it as their username.

Once generated, invoke the `enroll(string)` method with the token as the parameter.

```typescript
const jwt: string = 'jwt.token-with-subject-claim.signature' // generated from your backend
const controller: AbortController = new AbortController()

new trusona.WebAuthnEnrollment().enroll(jwt, controller.signal)
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
const controller: AbortController = new AbortController()
const usernameHint: string|undefined = 'username-hint' // optional, may be undefined

new trusona.WebAuthnAuthentication().authenticate(controller.signal, usernameHint)
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

## Manage A Users' Passkeys

You can manage a user's passkeys with implemented the `PasskeyManagement` interface.

An instance of a `PasskeyManagement` is created using the provided `JWT` access token available from `AuthenticationResult`

All active credentials can be returned, and they can be individually deleted.

See the summary below.



# API Summary

```typescript

static async DefaultPreflightChecks.supported () => Promise<boolean>

static async Initializer.initialize(tenantId: string) => Promise<void>

// Instance method of WebAuthnEnrollment
//
async enroll: (token: string, abortSignal?: AbortSignal) => Promise<EnrollmentResult>


// Instance methods of WebAuthnAuthentication
//
async authenticate: (abortSignal: AbortSignal, userIdentifier?: string) => Promise<AuthenticationResult>

// if you have a "webauthn" annotated input field you can use CUI
//
// See https://github.com/w3c/webauthn/wiki/Explainer:-WebAuthn-Conditional-UI
//
async cui: (abortSignal: AbortSignal) => Promise<AuthenticationResult>


// Instance methods of PasskeyManagement
//
const passkeyManagement = new DefaultPasskeyManagement(authenticationResult.accessToken) 

// Returns an array of all active and unexpired passkeys for the currently authenticated user.
//
asnyc get() => Promise<PassKey[]>

// Returns a Promise of true indicating that the specified passkey was successfully deleted.
//
async deletePasskey: (id: string) => Promise<boolean>

// If found, returns the specified passkey. Inactive, or expired passkeys cannot be retrieved.
//
async getPasskey: (id: string) => Promise<PassKey>

```

# Troubleshooting

If initialization of the SDK fails, verify that you have specified the correct `tenantId`.