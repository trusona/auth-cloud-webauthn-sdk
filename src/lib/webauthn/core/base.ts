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

  protected async recordEvent (eventType: string): Promise<void> {
    const sessionId = localStorage.getItem(Initializer._chl) ?? undefined
    const userIdentifier = localStorage.getItem(Initializer._kid) ?? undefined
    const event = { type: eventType, user_identifier: userIdentifier, session_id: sessionId }

    fetch(Initializer.analyticsEndpoint,
      {
        method: 'POST',
        body: JSON.stringify(event),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      .catch((_) => {
        // ok to ignore if it fails
      })
  }
}
