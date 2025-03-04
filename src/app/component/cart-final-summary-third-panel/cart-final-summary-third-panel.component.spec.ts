import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartFinalSummaryThirdPanelComponent } from './cart-final-summary-third-panel.component';

describe('CartFinalSummaryThirdPanelComponent', () => {
  let component: CartFinalSummaryThirdPanelComponent;
  let fixture: ComponentFixture<CartFinalSummaryThirdPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartFinalSummaryThirdPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartFinalSummaryThirdPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
