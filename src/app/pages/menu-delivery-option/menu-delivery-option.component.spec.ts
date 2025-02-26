import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDeliveryOptionComponent } from './menu-delivery-option.component';

describe('MenuDeliveryOptionComponent', () => {
  let component: MenuDeliveryOptionComponent;
  let fixture: ComponentFixture<MenuDeliveryOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuDeliveryOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDeliveryOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
