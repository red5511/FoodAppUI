import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartFinalSummarySecondPanelComponent } from './cart-final-summary-second-panel.component';

describe('CartFinalSummarySecondPanelComponent', () => {
  let component: CartFinalSummarySecondPanelComponent;
  let fixture: ComponentFixture<CartFinalSummarySecondPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartFinalSummarySecondPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartFinalSummarySecondPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
