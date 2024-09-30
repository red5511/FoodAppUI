import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSidebarElementComponent } from './order-sidebar-element.component';

describe('OrderSidebarElementComponent', () => {
  let component: OrderSidebarElementComponent;
  let fixture: ComponentFixture<OrderSidebarElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderSidebarElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSidebarElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
