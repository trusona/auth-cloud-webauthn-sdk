import { Initializer } from './configuration'
import { WebAuthnOptions } from './webauthn.options'
import { FailedAuthenticationError } from '../utils/errors'
import { Strings } from '../utils/strings'
import { Base } from './base'
import { PublicKeyCredentialRequestOptionsJSON, PublicKeyCredentialWithAssertionJSON } from '@github/webauthn-json/dist/types/basic/json'

/**
 * @description
 * An authentication result available after a successful authentication.
 *
 * If set, both the @param idToken and @param accessToken can be verified with https://YOUR-TENANT-DOMAIN/.well-known/jwks
 *
 * If either of these JWTs are not available, the sign-in event is not valid.
 *
 * When returned, the @param idToken is only valid for a brief period of time, currently 3 minutes.
 *
 * The @param accessToken is valid for a longer period of time, currently 24 hours.
 */
export interface AuthenticationResult {
  idToken: string
  accessToken: string
  status: AuthenticationStatus
}

export interface AssertionTransaction {
  options: PublicKeyCredentialRequestOptionsJSON
  transactionId: string
}

export interface CredentialTransaction {
  credential: PublicKeyCredentialWithAssertionJSON
  transactionId: string
}

export enum AuthenticationStatus {
  SUCCESS = 'SUCCESS'
}

export interface Authentication {
  authenticate: (abortSignal: AbortSignal, userIdentifier?: string, cui?: boolean) => Promise<AuthenticationResult>
  cui: (abortSignal: AbortSignal) => Promise<AuthenticationResult>
}

export class WebAuthnAuthentication extends Base implements Authentication {
  constructor (
    private readonly webAuthnOptions: WebAuthnOptions = new WebAuthnOptions()
  ) {
    super()
  }

  async cui (abortSignal: AbortSignal): Promise<AuthenticationResult> {
    if (!Initializer.webauthnStatus.conditionalMediation) {
      return await Promise.reject(new Error('CUI is not supported'))
    }
    return await this.authenticate(abortSignal, undefined, true)
  }

  /**
   * Authenticate the user.
   *
   * @param abortSignal - Optional.
   * @param userIdentifier - Optional. If not provided, discoverable credentials with prompt the user.
   *
   * @returns @see AuthenticationResult
   */
  async authenticate (abortSignal: AbortSignal, userIdentifier?: string, cui = false): Promise<AuthenticationResult> {
    if (!Initializer.webauthnStatus.platformAuthenticator) {
      return await Promise.reject(new Error('Platform authenticator was not detected'))
    }

    const challenge = await this.challenge()

    if (challenge === undefined) {
      return await Promise.reject(new Error('Failed to obtain challenge.'))
    }

    const blank: boolean = Strings.blank(userIdentifier ?? '')
    return await this.finalize(cui, challenge, abortSignal, blank ? undefined : userIdentifier?.trim())
  }

  private async finalize (cui: boolean, challenge: string, abortSignal?: AbortSignal, userIdentifier?: string): Promise<AuthenticationResult> {
    const credentialTransaction = await this.webAuthnOptions.getCredential(cui, abortSignal, userIdentifier)
    const credentialUserIdentifier = window.atob(credentialTransaction?.credential?.response.userHandle ?? '')

    const login = {
      method: 'PUBLIC_KEY_CREDENTIAL',
      nextStep: 'VERIFY_PUBLIC_KEY_CREDENTIAL',
      credentialTransaction,
      challenge,
      userIdentifier: credentialUserIdentifier,
      displayName: credentialUserIdentifier,
      transactionId: credentialTransaction?.transactionId,
      response: credentialTransaction?.credential
    }

    const response = await fetch(Initializer.loginsEndpoint,
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(login),
        headers: Initializer.headers
      })

    const map = response.ok ? await response.json() : undefined
    const idToken = map.idToken
    const accessToken = map.accessToken

    await this.recordEvent(idToken !== undefined ? 'SIGNIN_SUCCESS' : 'SIGNIN_FAILED')

    return idToken !== undefined
      ? await Promise.resolve({ status: AuthenticationStatus.SUCCESS, idToken, accessToken })
      : await Promise.reject(new FailedAuthenticationError())
  }

  protected async challenge (): Promise<string | undefined> {
    const url: string = `${Initializer.configuration?.tenantUrl ?? ''}/api/login_challenges`

    const response = await fetch(url, { method: 'POST', body: '{}', headers: Initializer.headers })
    const map = await response.json()

    localStorage.setItem(Initializer._chl, map?.login_challenge)
    await this.recordEvent('BIOMETRIC_START')

    return await Promise.resolve(map?.login_challenge)
  }
}
