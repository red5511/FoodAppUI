import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductPropertiesListComponent } from './new-product-properties-list.component';

describe('NewProductPropertiesListComponent', () => {
  let component: NewProductPropertiesListComponent;
  let fixture: ComponentFixture<NewProductPropertiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewProductPropertiesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProductPropertiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
