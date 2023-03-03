
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
