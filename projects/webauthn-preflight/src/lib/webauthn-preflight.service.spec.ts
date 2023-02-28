import { TestBed } from '@angular/core/testing'

import { WebauthnPreflightService } from './webauthn-preflight.service'

describe('WebauthnPreflightService', () => {
  let service: WebauthnPreflightService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(WebauthnPreflightService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
