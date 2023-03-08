export interface PreflightChecks {
  isSupported: () => Promise<boolean>
}

export class DefaultPreflightChecks implements PreflightChecks {
  static async supported (): Promise<boolean> {
    return await new DefaultPreflightChecks().isSupported()
  }

  async isSupported (): Promise<boolean> {
    try {
      const value: boolean = typeof window.PublicKeyCredential !== 'undefined' &&
    (await this.isUserVerifyingPlatformAuthenticatorAvailable())?.valueOf() &&
    (await this.isConditionalMediationAvailable())?.valueOf()

      return await Promise.resolve(value)
    } catch (e) {
      return await Promise.reject(new Error('PublicKeyCredential support not found'))
    }
  }

  private async isConditionalMediationAvailable (): Promise<boolean> {
    // @ts-expect-error
    return await window.PublicKeyCredential?.isConditionalMediationAvailable?.() // eslint-disable-line @typescript-eslint/return-await
  }

  private async isUserVerifyingPlatformAuthenticatorAvailable (): Promise<boolean> {
    return await window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.()
  }
}
