import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartRightBarComponent } from './cart-right-bar.component';

describe('CartRightBarComponent', () => {
  let component: CartRightBarComponent;
  let fixture: ComponentFixture<CartRightBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartRightBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartRightBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
