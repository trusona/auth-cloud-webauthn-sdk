export interface Preflight {
  /**
   * `true` if the device supports a platform authenticator
   */
  platformAuthenticator: boolean

  /**
   * `true` if the device supports conditional mediation - https://github.com/w3c/webauthn/wiki/Explainer:-WebAuthn-Conditional-UI
   */
  conditionalMediation: boolean

  /**
   * `true` if the device supports some form of WebAuthn
   */
  webauthn: boolean
}

export interface PreflightChecks {
  isSupported: () => Promise<boolean>
}

export class DefaultPreflightChecks implements PreflightChecks {
  /**
   * @deprecated The method should not be used and will be removed in a future version - use #check() instead
   */
  static async supported (): Promise<boolean> {
    const webauthnStatus = await DefaultPreflightChecks.check()
    return webauthnStatus.webauthn && webauthnStatus.conditionalMediation && webauthnStatus.platformAuthenticator
  }

  static async check (): Promise<Preflight> {
    const instance = new DefaultPreflightChecks()
    const v0 = typeof window.PublicKeyCredential !== 'undefined'
    const v1 = v0 && await instance.isConditionalMediationAvailable()
    const v2 = v0 && await instance.isUserVerifyingPlatformAuthenticatorAvailable()

    return await Promise.resolve({ platformAuthenticator: v2, conditionalMediation: v1, webauthn: v0 })
  }

  /**
   * @deprecated The method should not be used and will be removed in a future version - use #check() instead
   */
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
