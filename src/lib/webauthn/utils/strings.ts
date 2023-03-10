
export const Strings = {

  blank (value: string | undefined): boolean {
    return value === undefined || !(value?.trim()?.length > 0)
  }
}
