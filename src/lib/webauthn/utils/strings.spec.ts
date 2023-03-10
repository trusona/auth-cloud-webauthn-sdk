import { Strings } from './strings'

describe('Strings', () => {
  describe('#blank', () => {
    describe('when a blank string is provided', () => {
      it('returns true', () => {
        expect(Strings.blank(' ')).toBe(true)
      })
    })

    describe('when a blank string is provided', () => {
      it('returns true', () => {
        expect(Strings.blank('')).toBe(true)
      })
    })

    describe('when a valid string is provided', () => {
      it('returns false', () => {
        expect(Strings.blank('undefined')).toBe(false)
      })
    })
  })
})
