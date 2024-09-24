import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSidebnarComponent } from './order-sidebnar.component';

describe('OrderSidebnarComponent', () => {
  let component: OrderSidebnarComponent;
  let fixture: ComponentFixture<OrderSidebnarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderSidebnarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSidebnarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
