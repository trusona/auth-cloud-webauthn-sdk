import { TestBed } from '@angular/core/testing'

import { WebauthnCoreService } from './webauthn-core.service'

describe('WebauthnCoreService', () => {
  let service: WebauthnCoreService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(WebauthnCoreService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
