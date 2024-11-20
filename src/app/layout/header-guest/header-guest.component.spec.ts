import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderGuestComponent } from './header-guest.component';

describe('HeaderGuestComponent', () => {
  let component: HeaderGuestComponent;
  let fixture: ComponentFixture<HeaderGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderGuestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
