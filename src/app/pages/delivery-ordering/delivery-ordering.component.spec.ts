import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryOrderingComponent } from './delivery-ordering.component';

describe('DeliveryOrderingComponent', () => {
  let component: DeliveryOrderingComponent;
  let fixture: ComponentFixture<DeliveryOrderingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryOrderingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryOrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
