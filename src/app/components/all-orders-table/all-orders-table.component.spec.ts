import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOrdersTableComponent } from './all-orders-table.component';

describe('AllOrdersTableComponent', () => {
  let component: AllOrdersTableComponent;
  let fixture: ComponentFixture<AllOrdersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllOrdersTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOrdersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
