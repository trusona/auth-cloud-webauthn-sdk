import { Initializer } from '../core/configuration'

export interface KnownUsersService {
  knownUser: (userIdentifier: string) => boolean
  unknownUser: (userIdentifier: string) => boolean
  lastUser: () => string
  add: (userIdentifier: string) => void
}

export class NoOperationKnownUsersService implements KnownUsersService {
  knownUser (_: string): boolean {
    return false
  }

  unknownUser (_: string): boolean {
    return true
  }

  lastUser (): string {
    return ''
  }

  add (_: string): void { }
}

export class DefaultKnownUsersService implements KnownUsersService {
  private readonly kid = '__kid'
  private readonly cid = '__cid'
  private readonly max = 5

  knownUser (userIdentifier: string): boolean {
    return userIdentifier.trim().length > 0 && new Set(this.knownUsers()).has(userIdentifier)
  }

  unknownUser (userIdentifier: string): boolean {
    return !this.knownUser(userIdentifier)
  }

  lastUser (): string {
    return window.atob(localStorage.getItem(this.cid) ?? '')
  }

  add (userIdentifier: string): void {
    if (userIdentifier.trim().length > 0) {
      this.currentUser(userIdentifier)

      if (this.unknownUser(userIdentifier)) {
        const users = this.knownUsers()
        users.push(userIdentifier)

        if (users.length > this.max) {
          const set: string[] = []
          let idx = 0

          users.forEach(element => {
            if (idx++ > 0) {
              set.push(element)
            }
          })
          this.save(set)
        } else {
          this.save(users)
        }
      }
    }
  }

  private currentUser (userIdentifier: string): void {
    localStorage.setItem(this.cid, window.btoa(userIdentifier))
  }

  private save (users: string[]): void {
    localStorage.setItem(this.kid, window.btoa(JSON.stringify(users)))
  }

  private knownUsers (): string[] {
    try {
      const json = localStorage.getItem(this.kid)
      return JSON.parse(window.atob(json ?? '')) ?? []
    } catch (e) {
      return []
    }
  }
}

export function initKnownUsersService (): KnownUsersService {
  return Initializer.configuration?.useLocalStorage === true ? new DefaultKnownUsersService() : new NoOperationKnownUsersService()
}
