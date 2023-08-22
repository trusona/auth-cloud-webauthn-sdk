# Trusona AuthCloud WebAuthn SDK

[![.github/workflows/ci-tester.yml](https://github.com/trusona/auth-cloud-webauthn-sdk/actions/workflows/ci-tester.yml/badge.svg)](https://github.com/trusona/auth-cloud-webauthn-sdk/actions/workflows/ci-tester.yml)
[![latest](https://raw.githubusercontent.com/trusona/auth-cloud-webauthn-sdk/master/version.svg)](https://www.npmjs.com/package/@trusona/webauthn)

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

## Preflight Checks

It is prudent to perform some preflight checks before you initialize the SDK to ensure your users have a compatible browser.

This can be accomplished with a static `check()` method that returns an object with various properties indicating the available WebAuthn capabilities that would allow the user to successfully complete enrollment and authentication on their current browser.

```typescript

const deviceSupport:Preflight = await trusona.DefaultPreflightChecks.check()

if (deviceSupport.webauthn) {
  if(deviceSupport.platformAuthenticator && deviceSupport.conditionalMediation) {
    // browser has a hardware platform authenticator and can complete CUI
    // notes on CUI - https://github.com/w3c/webauthn/wiki/Explainer:-WebAuthn-Conditional-UI
    //
  }
  if(deviceSupport.platformAuthenticator && !deviceSupport.conditionalMediation) {
    // browser has a hardware platform authenticator but does not have CUI support
    //
  }
  if(!deviceSupport.platformAuthenticator && !deviceSupport.conditionalMediation) {
    // browser does *not* have a hardware platform authenticator and does not have CUI support
    //
  }
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
const origin:string = 'sdk-webauthn.your-domain.com'

trusona.Initializer.initialize(origin)
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

To authenticate a user, you can provide a username hint to the SDK or not - `lastUserHint()` is available to provide such a hint.

On success, a JWT is going to be provided in the SDK response that you can examine and verify the identity of the user.

> The `subject` claim in the provided JWT will match `subject` that was provided during enrollment. 

```typescript
const controller: AbortController = new AbortController()
const webAuthnAuthentication = new trusona.WebAuthnAuthentication()
const usernameHint: string = webAuthnAuthentication.lastUserHint() // optional

webAuthnAuthentication.authenticate(controller.signal, usernameHint)
  .then((map) => {
     // JWT from Trusona identifying the authenticated user
    const idToken:string = map.idToken
    const jwksEndpoint:string = trusona.Initializer.jwksEndpoint

    //
    // Verify the JWT against the Trusona's JWKS implementation endpoint.
    //
    // A "subject" claim will have the username of the authenticated user.
    //
  })
  .catch((error) => {
    // your error handling code ... authentication failed examine the provided error for details

    // Importantly, if the JWT cannot be verified, your users should end up here.
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

// Return a "hint" of the last user identifier that successfully enrolled or
// authenticated at this endpoint.
//
// If a value is not available, an empty (blank) string is returned.
//
// This feature is only applicable if `useLocalStorage` is enabled for your
// tenant, which is "on" by default.
//
lastUserHint: () => string

// Instance methods of PasskeyManagement
//
const passkeyManagement = new DefaultPasskeyManagement(authenticationResult.accessToken) 

// Returns an array of all active and unexpired passkeys for the currently authenticated user.
//
async get: () => Promise<PassKey[]>

// Returns a Promise of true indicating that the specified passkey was successfully deleted.
//
async deletePasskey: (id: string) => Promise<boolean>

// If found, returns the specified passkey. Inactive, or expired passkeys cannot be retrieved.
//
async getPasskey: (id: string) => Promise<PassKey>

```

# Troubleshooting

If initialization of the SDK fails, verify that you have specified the correct `origin`.
