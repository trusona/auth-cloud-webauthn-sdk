import * as WebAuthn from '@github/webauthn-json/dist/types/basic/json'
import * as errors from '../utils/errors'

import { WebAuthnOptions } from './webauthn.options'
import { Initializer } from './configuration'
import { Strings } from '../utils/strings'
import { Base } from './base'

export enum EnrollmentStatus { SUCCESS = 'SUCCESS' }

export interface EnrollmentResult { status: EnrollmentStatus }

export interface EnrollmentTransaction {
  transactionId: string
  credential: WebAuthn.PublicKeyCredentialWithAttestationJSON
}

export interface VerifiedEnrollment {
  id: string
  userIdentifier: string
  displayName: string
  redirectTo: string
}

export interface EnrollmentOptions {
  options: WebAuthn.PublicKeyCredentialCreationOptionsJSON
  enrollment: VerifiedEnrollment
}

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
    if (!Initializer.webauthnStatus.platformAuthenticator) {
      return await Promise.reject(new Error('Platform authenticator was not found'))
    }

    if (Strings.blank(token)) {
      return await Promise.reject(new Error('Blank token was provided'))
    }

    const response = await fetch(Initializer.enrollmentsEndpoint,
      { method: 'POST', body: JSON.stringify({ token }), credentials: 'include', headers: Initializer.headers })

    const enrollmentOptions: EnrollmentOptions = await response.json()
    const transactionId = enrollmentOptions.enrollment.id

    localStorage.setItem(Initializer._kid, enrollmentOptions.enrollment.userIdentifier)

    const credential = await this.webAuthnOptions.createCredential(enrollmentOptions.options, abortSignal)

    return response.ok
      ? await this.finalizeEnrollment({ credential, transactionId })
      : await Promise.reject(new errors.InvalidTokenEnrollmentError())
  }

  private async finalizeEnrollment (enrollmentTransaction: EnrollmentTransaction): Promise<EnrollmentResult> {
    if (enrollmentTransaction.credential === undefined) {
      return await Promise.reject(new errors.CancelledEnrollmentError())
    }

    const json = JSON.stringify({ credential: enrollmentTransaction.credential, transactionId: enrollmentTransaction.transactionId })
    const response = await fetch(Initializer.registrationsEndpoint, { method: 'POST', body: json, credentials: 'include', headers: Initializer.headers })

    await this.recordEvent(response.ok ? 'REGISTRATION' : 'REGISTRATION_FAILED')

    return response.ok
      ? await Promise.resolve({ status: EnrollmentStatus.SUCCESS })
      : await Promise.reject(new errors.FailedEnrollmentError())
  }
}
