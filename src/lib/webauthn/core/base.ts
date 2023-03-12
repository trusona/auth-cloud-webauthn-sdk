import { DefaultPreflightChecks } from '../preflight/preflight-checks'
import { Initializer } from './configuration'
import * as errors from '../utils/errors'

export class Base {
  protected async validate (): Promise<void> {
    if (Initializer.configuration?.clientId === undefined) {
      throw new errors.SdkInitializationError()
    }
    await DefaultPreflightChecks.supported()
      .then(async (v) => {
        if (!v) {
          await Promise.reject(new errors.UnsupportedBrowserError())
        }
      }
      ).catch(async (_) => await Promise.reject(new errors.UnsupportedBrowserError()))
  }
}
