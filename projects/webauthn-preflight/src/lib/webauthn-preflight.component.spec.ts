import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WebauthnPreflightComponent } from './webauthn-preflight.component'

describe('WebauthnPreflightComponent', () => {
  let component: WebauthnPreflightComponent
  let fixture: ComponentFixture<WebauthnPreflightComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebauthnPreflightComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(WebauthnPreflightComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
