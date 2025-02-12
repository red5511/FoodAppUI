import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartFinalSummaryFirstPanelComponent } from './cart-final-summary-first-panel.component';

describe('CartFinalSummaryFirstPanelComponent', () => {
  let component: CartFinalSummaryFirstPanelComponent;
  let fixture: ComponentFixture<CartFinalSummaryFirstPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartFinalSummaryFirstPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartFinalSummaryFirstPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
