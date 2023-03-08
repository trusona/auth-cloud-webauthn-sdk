
export class UnsupportedBrowserError extends Error {
  constructor () {
    super('This browser is not supported')
  }
}

export class SdkInitializationError extends Error {
  constructor () {
    super('The SDK is not yet initialized')
  }
}

export class CancelledEnrollmentError extends Error {
  constructor () {
    super('Enrollment was cancelled')
  }
}

export class FailedEnrollmentError extends Error {
  constructor () {
    super('Enrollment failed')
  }
}

export class InvalidTokenEnrollmentError extends Error {
  constructor () {
    super('Provided token was not valid.')
  }
}

export class FailedAuthenticationError extends Error {
  constructor () {
    super('Authentication did not succeed.')
  }
}
