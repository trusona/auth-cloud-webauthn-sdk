
export const Strings = {

  blank (value: string): boolean {
    return value === undefined || !(value?.trim()?.length > 0)
  }
}
