import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberInputForMobileOrWwwComponent } from './number-input-for-mobile-or-www.component';

describe('NumberInputForMobileOrWwwComponent', () => {
  let component: NumberInputForMobileOrWwwComponent;
  let fixture: ComponentFixture<NumberInputForMobileOrWwwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberInputForMobileOrWwwComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberInputForMobileOrWwwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
