import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON, PublicKeyCredentialWithAssertionJSON } from '@github/webauthn-json/dist/types/basic/json'
import { Initializer } from './configuration'
import * as WebAuthn from '@github/webauthn-json'

export class WebAuthnOptions {
  async getCredential (cui: boolean = false, abortSignal?: AbortSignal, userIdentifier?: string): Promise<PublicKeyCredentialWithAssertionJSON | undefined> {
    const requestOptions: PublicKeyCredentialRequestOptionsJSON = await this.requestOptions(userIdentifier)
    requestOptions.rpId = window.location.hostname
    requestOptions.userVerification = 'preferred'

    let params

    if (cui && abortSignal !== undefined && userIdentifier === undefined) {
      params = { publicKey: requestOptions, signal: abortSignal, mediation: ('conditional' as CredentialMediationRequirement) }
    } else {
      params = abortSignal !== undefined ? { publicKey: requestOptions, signal: abortSignal } : { publicKey: requestOptions }
    }

    return requestOptions !== undefined ? await WebAuthn.get(params) : await Promise.resolve(undefined)
  }

  async createCredential (abortSignal?: AbortSignal): Promise<WebAuthn.PublicKeyCredentialWithAttestationJSON | undefined> {
    return await this.attestationOptions()
      .then(async (options) => {
        options.rp.name = window.location.hostname
        options.rp.id = undefined
        options.attestation = 'direct'

        localStorage.setItem(Initializer._kid, options.user.name)

        return abortSignal !== undefined
          ? await WebAuthn.create({ publicKey: options, signal: abortSignal })
          : await WebAuthn.create({ publicKey: options })
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
