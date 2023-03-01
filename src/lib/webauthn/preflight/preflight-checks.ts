export interface PreflightChecks {
  isSupported: () => Promise<boolean>
}

export class DefaultPreflightChecks implements PreflightChecks {
  async isSupported (): Promise<boolean> {
    const v0: boolean = typeof window.PublicKeyCredential !== 'undefined'
    const v1: boolean = v0 && (await this.isUserVerifyingPlatformAuthenticatorAvailable()).valueOf()
    const v2: boolean = v1 && (await this.isConditionalMediationAvailable()).valueOf()

    return await new Promise<boolean>((resolve) => { resolve(v2) })
  }

  private async isConditionalMediationAvailable (): Promise<boolean> {
    // @ts-expect-error
    return window.PublicKeyCredential?.isConditionalMediationAvailable?.()
  }

  private async isUserVerifyingPlatformAuthenticatorAvailable (): Promise<boolean> {
    return await window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.()
  }
}
