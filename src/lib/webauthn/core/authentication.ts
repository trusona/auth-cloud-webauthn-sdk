import { DefaultPreflightChecks, PreflightChecks } from '../preflight/preflight-checks'
import { Initializer } from './configuration'
import { WebAuthnOptions } from './webauthn.options'
import { FailedAuthenticationError, SdkInitializationError, UnsupportedBrowserError } from '../utils/errors'
import { Strings } from '../utils/strings'

/**
 * @description
 * An authentication result available after a successful authentication.
 *
 * If set, the @param token can be verified with https://YOUR-TENANT-DOMAIN/.well-known/jwks
 *
 * If the @param token is not available, the sign-in is not valid.
 */

export interface AuthenticationResult {
  token: string
  status: AuthenticationStatus
}

export enum AuthenticationStatus {
  SUCCESS = 'SUCCESS'
}

export interface Authentication {
  authenticate: (abortSignal: AbortSignal, userIdentifier?: string) => Promise<AuthenticationResult>
}

export class WebAuthnAuthentication implements Authentication {
  constructor (
    private readonly preflightChecks: PreflightChecks = new DefaultPreflightChecks(),
    private readonly webAuthnOptions: WebAuthnOptions = new WebAuthnOptions()
  ) { }

  /**
   * Authenticate the user.
   *
   * @param abortSignal - Optional.
   * @param userIdentifier - Optional. If not provided, discoverable credentials with prompt the user.
   *
   * @returns @see AuthenticationResult
   */
  async authenticate (abortSignal?: AbortSignal, userIdentifier?: string): Promise<AuthenticationResult> {
    if (Initializer.configuration?.clientId === undefined) {
      return await Promise.reject(new SdkInitializationError())
    }

    if (!(await this.preflightChecks.isSupported())) {
      return await Promise.reject(new UnsupportedBrowserError())
    }

    const challenge = await this.challenge()

    if (challenge === undefined) {
      return await Promise.reject(new Error('Failed to obtain challenge.'))
    }

    const blank: boolean = Strings.blank(userIdentifier ?? '')
    const credential = await this.webAuthnOptions.getCredential(abortSignal, blank ? undefined : userIdentifier?.trim())
    const credentialUserIdentifier = window.atob(credential?.response.userHandle ?? '')

    const login = {
      method: 'PUBLIC_KEY_CREDENTIAL',
      nextStep: 'VERIFY_PUBLIC_KEY_CREDENTIAL',
      challenge,
      userIdentifier: credentialUserIdentifier,
      displayName: credentialUserIdentifier,
      response: credential
    }

    const response = await fetch(Initializer.loginsEndpoint,
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(login),
        headers: { 'Content-Type': 'application/json' }
      })

    const map = response.ok ? await response.json() : undefined

    return map?.token !== undefined
      ? await Promise.resolve({ status: AuthenticationStatus.SUCCESS, token: map.token })
      : await Promise.reject(new FailedAuthenticationError())
  }

  protected async challenge (): Promise<string | undefined> {
    const url: string = `${Initializer.configuration?.tenantUrl ?? ''}/api/login_challenges`

    const response = await fetch(url, { method: 'POST', body: '{}', headers: { 'Content-Type': 'application/json' } })
    const map = await response.json()

    return await Promise.resolve(map?.login_challenge)
  }
}
