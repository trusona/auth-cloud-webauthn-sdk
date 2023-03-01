
export interface PreflightChecks {
  supportsCui: () => Promise<boolean>
}

export class DefaultPreflightChecks implements PreflightChecks {
  async supportsCui (): Promise<boolean> {
    return await new Promise((resolve) => {
      resolve(false)
    })
  }
}
