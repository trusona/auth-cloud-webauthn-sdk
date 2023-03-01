
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
  async authenticate (userIdentifier: string): Promise<AuthenticationResult> {

    // fail if NOT supported by preflight

    // FAIL if initialization is not set - exception

    // build a LOGIN object

    // make a request to oath2 to get a challenge

    /**
 * code flow
 *
 * curl -v  "https://authcloud.staging.trusona.net/oauth2/auth?
 * client_id=e161b4ce-fb40-4c69-ac31-3fc7886015ab&scope=openid
 * &state=682ce22c-4f4c-4db8-b849-29142761993c
 * &nonce=tacos&redirect_uri=http://localhost:8080/...
 *
 * hydra will return a path ath will have access to the token
 *
 *
 */

    // stuff it (LOGIN) correctly

  }
}
