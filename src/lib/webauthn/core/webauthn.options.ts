import { type PublicKeyCredentialCreationOptionsJSON } from '@github/webauthn-json/dist/types/basic/json'
import { type AssertionTransaction, type CredentialTransaction } from './authentication'
import { Initializer } from './configuration'
import * as WebAuthn from '@github/webauthn-json'

export class WebAuthnOptions {
  async getCredential (cui: boolean = false, abortSignal?: AbortSignal, userIdentifier?: string): Promise<CredentialTransaction | undefined> {
    const authenticationAssertionTransaction = await this.requestOptions(userIdentifier)
    const requestOptions = authenticationAssertionTransaction.options
    const transactionId = authenticationAssertionTransaction.transactionId

    requestOptions.rpId = window.location.hostname
    requestOptions.userVerification = 'preferred'

    let params

    if (cui && abortSignal !== undefined && userIdentifier === undefined) {
      params = { publicKey: requestOptions, signal: abortSignal, mediation: ('conditional' as CredentialMediationRequirement) }
    } else {
      params = abortSignal !== undefined ? { publicKey: requestOptions, signal: abortSignal } : { publicKey: requestOptions }
    }

    const credential: WebAuthn.PublicKeyCredentialWithAssertionJSON = await WebAuthn.get(params)
    return requestOptions !== undefined ? await Promise.resolve({ credential, transactionId }) : await Promise.resolve(undefined)
  }

  async createCredential (options: PublicKeyCredentialCreationOptionsJSON, abortSignal?: AbortSignal): Promise<WebAuthn.PublicKeyCredentialWithAttestationJSON> {
    return abortSignal !== undefined
      ? await WebAuthn.create({ publicKey: options, signal: abortSignal })
      : await WebAuthn.create({ publicKey: options })
  }

  private async requestOptions (userIdentifier?: string): Promise<AssertionTransaction> {
    const url = `${Initializer.assertionOptionsEndpoint}?userIdentifier=${encodeURIComponent(userIdentifier ?? '')}`
    const response = await fetch(url, { credentials: 'include', headers: Initializer.headers })
    return response.ok ? await response.json() : await Promise.reject(new Error('Failed to get assertion options.'))
  }
}
