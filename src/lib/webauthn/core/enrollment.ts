
export enum EnrollmentStatus {
  SUCCESS,
  CANCELLED,
  INVALID_TOKEN,
  UNSUPPORTED_BROWSER
}

export interface EnrollmentResult {
  status: EnrollmentStatus

}

export interface Enrollment {
  enroll: (token: string) => Promise<EnrollmentResult>
}

export class WebAuthnEnrollment implements Enrollment {
  async enroll (token: string): Promise<EnrollmentResult> {
    // fail if NOT supported by preflight

    // FAIL if not configured -- exception

    // pass send to endpoint

    // on succss prompt for webauthn registration like in TAC

    return { status: EnrollmentStatus.CANCELLED }
  }
}
