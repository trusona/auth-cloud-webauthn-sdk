import { DefaultPreflightChecks, PreflightChecks } from '../preflight/preflight-checks'
import { Initializer } from './configuration'
import { buildUrl } from 'build-url-ts'
import { uuidV4 } from 'fast-uuidv4'
import parseUrl from 'parse-url'

export interface AuthenticationResult {
  token?: string
  status: AuthenticationStatus
}

export enum AuthenticationStatus {
  SUCCESS,
  FAILED,
  UNSUPPORTED_BROWSER
}

export interface Authentication {
  authenticate: (userIdentifier: string) => Promise<AuthenticationResult>
}

export class WebAuthnAuthentication implements Authentication {
  constructor (
    private readonly preflightChecks: PreflightChecks = new DefaultPreflightChecks()
  ) { }

  async authenticate (userIdentifier: string): Promise<AuthenticationResult> {
    if (Initializer.configuration?.clientId === undefined) {
      return await Promise.reject(new Error('Initialization has not yet occurred'))
    }

    if (!(await this.preflightChecks.isSupported())) {
      return await Promise.reject(new Error('This browser is not supported'))
    }

    if (userIdentifier.trim() === '') {
      return await Promise.reject(new Error('Blank user identifier was provided'))
    }

    const challenge = await this.challenge()

    if (challenge === undefined) {
      return await Promise.reject(new Error('Failed to obtain challenge'))
    }

    // prompt for webauthn

    // build a LOGIN object and POST

    // stuff it (LOGIN) correctly

    return await Promise.resolve({} as AuthenticationResult)
  }

  private async challenge (): Promise<string | undefined> {
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
    const loginUrl = response.ok ? response.headers.get('location') : undefined

    if (loginUrl) {
      return await Promise.resolve(parseUrl(loginUrl).query.login_challenge)
    }

    return await Promise.resolve(undefined)
  }
}
