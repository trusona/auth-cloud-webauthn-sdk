export interface Preflight {
  platformAuthenticator: boolean
  conditionalMediation: boolean
  webauthn: boolean
}

export interface PreflightChecks {
  isSupported: () => Promise<boolean>
}

export class DefaultPreflightChecks implements PreflightChecks {
  static async supported (): Promise<boolean> {
    return await new DefaultPreflightChecks().isSupported()
  }

  static async check (): Promise<Preflight> {
    const instance = new DefaultPreflightChecks()
    const v0 = typeof window.PublicKeyCredential !== 'undefined'
    const v1 = v0 && await instance.isConditionalMediationAvailable()
    const v2 = v0 && await instance.isUserVerifyingPlatformAuthenticatorAvailable()

    return await Promise.resolve({ platformAuthenticator: v2, conditionalMediation: v1, webauthn: v0 })
  }

  async isSupported (): Promise<boolean> {
    const value: boolean = typeof window.PublicKeyCredential !== 'undefined' &&
    (await this.isUserVerifyingPlatformAuthenticatorAvailable())?.valueOf() &&
    (await this.isConditionalMediationAvailable())?.valueOf()

    return await Promise.resolve(value)
  }

  private async isConditionalMediationAvailable (): Promise<boolean> {
    // @ts-expect-error
    return await window.PublicKeyCredential?.isConditionalMediationAvailable?.() // eslint-disable-line @typescript-eslint/return-await
  }

  private async isUserVerifyingPlatformAuthenticatorAvailable (): Promise<boolean> {
    return await window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.()
  }
}
