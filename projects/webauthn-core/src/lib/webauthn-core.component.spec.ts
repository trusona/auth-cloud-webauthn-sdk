import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WebauthnCoreComponent } from './webauthn-core.component'

describe('WebauthnCoreComponent', () => {
  let component: WebauthnCoreComponent
  let fixture: ComponentFixture<WebauthnCoreComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebauthnCoreComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(WebauthnCoreComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
