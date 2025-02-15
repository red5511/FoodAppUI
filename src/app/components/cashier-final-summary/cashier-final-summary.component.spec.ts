import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierFinalSummaryComponent } from './cashier-final-summary.component';

describe('CashierFinalSummaryComponent', () => {
  let component: CashierFinalSummaryComponent;
  let fixture: ComponentFixture<CashierFinalSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashierFinalSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierFinalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
