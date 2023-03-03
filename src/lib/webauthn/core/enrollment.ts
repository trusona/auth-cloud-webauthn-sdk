import { DefaultPreflightChecks, PreflightChecks } from '../preflight/preflight-checks'
import { Strings } from '../utils/strings'
import { Initializer } from './configuration'
import { WebAuthnOptions } from './webauthn.options'

export enum EnrollmentStatus {
  SUCCESS,
  CANCELLED,
  FAILED,
  INVALID_TOKEN,
  SDK_NOT_INITIALIZED,
  UNSUPPORTED_BROWSER
}

export interface EnrollmentResult {
  status: EnrollmentStatus

}

export interface Enrollment {
  enroll: (token: string, abortSignal: AbortSignal) => Promise<EnrollmentResult>
}

export class WebAuthnEnrollment implements Enrollment {
  constructor (
    private readonly preflightChecks: PreflightChecks = new DefaultPreflightChecks(),
    private readonly webAuthnOptions: WebAuthnOptions = new WebAuthnOptions()
  ) { }

  async enroll (token: string, abortSignal: AbortSignal): Promise<EnrollmentResult> {
    if (Initializer.configuration?.clientId === undefined) {
      return await Promise.resolve({ status: EnrollmentStatus.SDK_NOT_INITIALIZED })
    }

    if (!(await this.preflightChecks.isSupported())) {
      return await Promise.resolve({ status: EnrollmentStatus.UNSUPPORTED_BROWSER })
    }

    if (Strings.blank(token)) {
      return await Promise.reject(new Error('Blank token was provided'))
    }

    const credential = await this.webAuthnOptions.createCredential(abortSignal)

    if (credential === undefined) {
      return await Promise.resolve({ status: EnrollmentStatus.CANCELLED })
    }

    const response = await fetch(Initializer.credentialsEndpoint,
      { method: 'POST', body: JSON.stringify(credential), credentials: 'include' })

    return await Promise.resolve({ status: response.ok ? EnrollmentStatus.SUCCESS : EnrollmentStatus.FAILED })
  }
}
