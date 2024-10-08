import { Initializer } from './configuration'

export class Base {
  protected async recordEvent (eventType: string): Promise<void> {
    const sessionId = localStorage.getItem(Initializer._chl)?.trim() ?? ''
    const userIdentifier = localStorage.getItem(Initializer._kid)?.trim() ?? ''

    if (userIdentifier.length === 0 || sessionId.length === 0) {
      return
    }

    const event = { type: eventType, user_identifier: userIdentifier, session_id: sessionId }

    fetch(Initializer.analyticsEndpoint,
      {
        method: 'POST',
        body: JSON.stringify(event),
        headers: Initializer.headers
      })
      .catch((_) => {
        // ok to ignore if it fails
      })
  }
}
