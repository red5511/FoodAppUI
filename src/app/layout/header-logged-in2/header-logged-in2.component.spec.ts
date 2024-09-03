import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLoggedIn2Component } from './header-logged-in2.component';

describe('HeaderLoggedIn2Component', () => {
  let component: HeaderLoggedIn2Component;
  let fixture: ComponentFixture<HeaderLoggedIn2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderLoggedIn2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderLoggedIn2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
