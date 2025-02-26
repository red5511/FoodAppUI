import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDeliveryOptionComponent } from './add-new-delivery-option.component';

describe('AddNewDeliveryOptionComponent', () => {
  let component: AddNewDeliveryOptionComponent;
  let fixture: ComponentFixture<AddNewDeliveryOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewDeliveryOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewDeliveryOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
