
import { Initializer } from './configuration'

describe('Configuration', () => {
  describe('#initialize', () => {
    describe('when a valid URL is provided', () => {
      beforeEach(() => {
        // @ts-expect-error
        global.fetch = jest.fn(async () =>
          await Promise.resolve({
            headers: {},
            status: 200,
            ok: true,
            json: async () => await Promise.resolve({ clientId: 'clientId' })
          }))
      })

      it('will initialize a valid configuration', async () => {
        await Initializer.initialize('http://localhost')
        expect(Initializer.configuration).toBeTruthy()
      })

      it('will initialize a clientId value', async () => {
        await Initializer.initialize('http://localhost')
        expect(Initializer.configuration?.clientId).toBe('clientId')
      })
    })

    describe('when an invalid URL is provided', () => {
      beforeEach(() => {
        // @ts-expect-error
        global.fetch = jest.fn(async () =>
          await Promise.resolve({
            headers: {},
            status: 404,
            ok: false
          }))
      })

      it('will throw an error', async () => {
        await expect(Initializer.initialize('http://localhost')).rejects.toThrowError('Configuration was not loaded')
      })
    })
  })
})
