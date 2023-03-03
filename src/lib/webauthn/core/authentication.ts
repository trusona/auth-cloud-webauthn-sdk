import { DefaultPreflightChecks, PreflightChecks } from '../preflight/preflight-checks'
import { Initializer } from './configuration'
import { buildUrl } from 'build-url-ts'
import { uuidV4 } from 'fast-uuidv4'
import parseUrl from 'parse-url'
import { WebAuthnOptions } from './webauthn.options'
import { SdkInitializationError, UnsupportedBrowserError } from '../utils/errors'

export interface AuthenticationResult {
  token?: string
  status: AuthenticationStatus
  error?: string
}

export enum AuthenticationStatus {
  SUCCESS,
  FAILED,
  UNSUPPORTED_BROWSER
}

export interface Authentication {
  authenticate: (userIdentifier: string, abortSignal: AbortSignal) => Promise<AuthenticationResult>
}

export class WebAuthnAuthentication implements Authentication {
  constructor (
    private readonly preflightChecks: PreflightChecks = new DefaultPreflightChecks(),
    private readonly webAuthnOptions: WebAuthnOptions = new WebAuthnOptions()
  ) { }

  async authenticate (userIdentifier: string, abortSignal: AbortSignal): Promise<AuthenticationResult> {
    if (Initializer.configuration?.clientId === undefined) {
      return await Promise.reject(new SdkInitializationError())
    }

    if (!(await this.preflightChecks.isSupported())) {
      return await Promise.reject(new UnsupportedBrowserError())
    }

    if (userIdentifier.trim() === '') {
      return await Promise.reject(new Error('Blank user identifier was provided'))
    }

    const challenge = await this.challenge()

    if (challenge === undefined) {
      return await Promise.reject(new Error('Failed to obtain challenge'))
    }

    const credential = await this.webAuthnOptions.getCredential(abortSignal, userIdentifier)
    const login = { method: 'VERIFY_PUBLIC_KEY_CREDENTIAL', challenge, userIdentifier, displayName: userIdentifier, response: credential }
    const response = await fetch(Initializer.loginsEndpoint,
      { method: 'POST', credentials: 'include', body: JSON.stringify(login), headers: { 'Content-Type': 'application/json' } }
    )

    return await Promise.resolve({ status: response.ok ? AuthenticationStatus.SUCCESS : AuthenticationStatus.FAILED })
  }

  async challenge (): Promise<string | undefined> {
    const url: string = buildUrl(Initializer.configuration?.tenantUrl, {
      path: 'oauth2/auth',
      queryParams: {
        client_id: Initializer.configuration?.clientId,
        response_type: 'id_token',
        state: uuidV4(),
        nonce: uuidV4()
      }
    })

    const response = await fetch(url, { redirect: 'manual' })
    const loginUrl = response.ok ? response.headers.get('location') : ''

    if (loginUrl != null) {
      return await Promise.resolve(parseUrl(loginUrl).query.login_challenge)
    }

    return await Promise.resolve(undefined)
  }
}
