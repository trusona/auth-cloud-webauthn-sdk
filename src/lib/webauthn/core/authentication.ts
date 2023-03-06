import { DefaultPreflightChecks, PreflightChecks } from '../preflight/preflight-checks'
import { Initializer } from './configuration'
import { WebAuthnOptions } from './webauthn.options'
import { SdkInitializationError, UnsupportedBrowserError } from '../utils/errors'
import { Strings } from '../utils/strings'

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

    if (Strings.blank(userIdentifier)) {
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

    if (response.ok) {
    ///
    // todo:
    // look at the redirect to value - go there - follow the redirects .. parse out the resulting body for a token

      const url = (await response.json()).redirectTo
      console.log(url)
    }

    return await Promise.resolve({ status: response.ok ? AuthenticationStatus.SUCCESS : AuthenticationStatus.FAILED })
  }

  async challenge (): Promise<string | undefined> {
    const url: string = `${Initializer.configuration?.tenantUrl ?? ''}/api/login_challenges`

    const response = await fetch(url, { method: 'POST', body: '{}', headers: { 'Content-Type': 'application/json' } })
    const map = await response.json()

    return await Promise.resolve(map?.login_challenge)
  }
}
