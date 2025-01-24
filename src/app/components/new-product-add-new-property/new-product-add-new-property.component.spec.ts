import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductAddNewPropertyComponent } from './new-product-add-new-property.component';

describe('NewProductAddNewPropertyComponent', () => {
  let component: NewProductAddNewPropertyComponent;
  let fixture: ComponentFixture<NewProductAddNewPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewProductAddNewPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProductAddNewPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
