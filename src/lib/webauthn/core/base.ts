import { DefaultPreflightChecks } from '../preflight/preflight-checks'
import { Initializer } from './configuration'
import * as errors from '../utils/errors'

export class Base {
  protected async validate (): Promise<void> {
    if (Initializer.configuration?.clientId === undefined) {
      return await Promise.reject(new errors.SdkInitializationError())
    }

    await DefaultPreflightChecks.supported()
      .then(async (v) => {
        return v ? await Promise.resolve() : await Promise.reject(new errors.UnsupportedBrowserError())
      }
      ).catch(async (_) => await Promise.reject(new errors.UnsupportedBrowserError()))
  }
}
