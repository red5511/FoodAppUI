import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartFinalSummaryComponent } from './cart-final-summary.component';

describe('CartFinalSummaryComponent', () => {
  let component: CartFinalSummaryComponent;
  let fixture: ComponentFixture<CartFinalSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartFinalSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartFinalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
