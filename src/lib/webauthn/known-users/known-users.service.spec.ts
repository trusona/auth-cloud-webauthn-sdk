/**
 * @jest-environment jsdom
 */
import { DefaultKnownUsersService, type KnownUsersService } from '../known-users/known-users.service'

describe('KnownUsersService', () => {
  const service: KnownUsersService = new DefaultKnownUsersService()

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should not known any user by default', () => {
    expect(service.knownUser('bob')).toBeFalsy()
    expect(service.unknownUser('bob')).toBeTruthy()
  })

  it('should know an added user', () => {
    service.add('bob')

    expect(service.knownUser('bob')).toBeTruthy()
  })

  it('should know an added user after duplicate calls', () => {
    service.add('bob')
    service.add('bob')

    expect(service.knownUser('bob')).toBeTruthy()
    expect(service.unknownUser('bob')).toBeFalsy()
  })

  it('should know an added user after duplicate multiple calls', () => {
    service.add('bob')
    service.add('bob')
    service.add('bob')
    service.add('bob')
    service.add('bob')

    expect(service.knownUser('bob')).toBeTruthy()
  })

  it('should not know a user that was not added', () => {
    service.add('bob')
    service.add('foo')

    expect(service.knownUser('bar')).toBeFalsy()
  })

  it('implements FIFO', () => {
    service.add('1')
    service.add('2')
    service.add('3')
    service.add('4')
    service.add('5')
    service.add('6')
    service.add('7')

    expect(service.knownUser('1')).toBeFalsy()
    expect(service.knownUser('2')).toBeFalsy()
    expect(service.knownUser('3')).toBeTruthy()
    expect(service.knownUser('4')).toBeTruthy()
    expect(service.knownUser('5')).toBeTruthy()
    expect(service.knownUser('6')).toBeTruthy()
    expect(service.knownUser('7')).toBeTruthy()
  })

  it('keeps track of the last added user ', () => {
    service.add('1')
    expect(service.knownUser('1')).toBeTruthy()
    expect(service.lastUser()).toEqual('1')

    service.add('2')
    expect(service.knownUser('2')).toBeTruthy()
    expect(service.lastUser()).toEqual('2')

    service.add('1')
    expect(service.knownUser('1')).toBeTruthy()
    expect(service.lastUser()).toEqual('1')
  })
})
