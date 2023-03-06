import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON, PublicKeyCredentialWithAssertionJSON } from '@github/webauthn-json/dist/types/basic/json'
import { Initializer } from './configuration'
import * as WebAuthn from '@github/webauthn-json'

export class WebAuthnOptions {
  async getCredential (abortSignal: AbortSignal, userIdentifier?: string): Promise<PublicKeyCredentialWithAssertionJSON | undefined> {
    const requestOptions: PublicKeyCredentialRequestOptionsJSON = await this.requestOptions(userIdentifier)
    return requestOptions !== undefined
      ? await WebAuthn.get({ publicKey: requestOptions, signal: abortSignal })
      : await Promise.resolve(undefined)
  }

  async createCredential (abortSignal: AbortSignal): Promise<WebAuthn.PublicKeyCredentialWithAttestationJSON | undefined> {
    return await this.attestationOptions()
      .then(async (options) => {
        options.rp.name = window.location.hostname
        options.rp.id = undefined

        return await WebAuthn.create({ publicKey: options, signal: abortSignal })
      })
      .then(async (c) => await Promise.resolve(c))
  }

  private async attestationOptions (): Promise<PublicKeyCredentialCreationOptionsJSON> {
    const response = await fetch(Initializer.attestationOptionsEndpoint, { credentials: 'include' })
    return response.ok ? await response.json() : await Promise.reject(new Error('Failed to obtain attestation options.'))
  }

  private async requestOptions (userIdentifier?: string): Promise<PublicKeyCredentialRequestOptionsJSON> {
    const url = `${Initializer.assertionOptionsEndpoint}?userIdentifier=${userIdentifier ?? ''}`
    const response = await fetch(url, { credentials: 'include' })
    return response.ok ? await response.json() : await Promise.reject(new Error('Failed to get assertion options.'))
  }
}
