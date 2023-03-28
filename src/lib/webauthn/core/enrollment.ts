import { Strings } from '../utils/strings'
import * as errors from '../utils/errors'
import { Initializer } from './configuration'
import { WebAuthnOptions } from './webauthn.options'
import { Base } from './base'

export enum EnrollmentStatus { SUCCESS = 'SUCCESS' }

export interface EnrollmentResult { status: EnrollmentStatus }

export interface Enrollment {
  enroll: (token: string, abortSignal?: AbortSignal) => Promise<EnrollmentResult>
}

export class WebAuthnEnrollment extends Base implements Enrollment {
  constructor (
    private readonly webAuthnOptions: WebAuthnOptions = new WebAuthnOptions()
  ) {
    super()
  }

  /**
   * Enrolls the user. This is typically the next method called after initialization if a user
   * has not been previously enrolled.
   *
   * @param token a valid JWT token
   * @param abortSignal
   *
   * @returns @see EnrollmentStatus - indicating the status of the enrollment
   */
  async enroll (token: string, abortSignal?: AbortSignal): Promise<EnrollmentResult> {
    await this.validate()

    if (Strings.blank(token)) {
      return await Promise.reject(new Error('Blank token was provided'))
    }

    const response = await fetch(Initializer.enrollmentsEndpoint,
      { method: 'POST', body: JSON.stringify({ token }), credentials: 'include', headers: { 'Content-Type': 'application/json' } })

    return response.ok ? await this.finalizeEnrollment(abortSignal) : await Promise.reject(new errors.InvalidTokenEnrollmentError())
  }

  private async finalizeEnrollment (abortSignal?: AbortSignal): Promise<EnrollmentResult> {
    const credential = await this.webAuthnOptions.createCredential(abortSignal)

    if (credential === undefined) {
      return await Promise.reject(new errors.CancelledEnrollmentError())
    }

    const response = await fetch(Initializer.credentialsEndpoint,
      { method: 'POST', body: JSON.stringify(credential), credentials: 'include', headers: { 'Content-Type': 'application/json' } })

    if (response.ok) {
      await this.recordEvent('REGISTRATION')

      return await Promise.resolve({ status: EnrollmentStatus.SUCCESS })
    } else {
      return await Promise.reject(new errors.FailedEnrollmentError())
    }
  }
}
