import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuProductPropertiesExpandedTableComponent } from './menu-product-properties-expanded-table.component';

describe('MenuProductPropertiesExpandedTableComponent', () => {
  let component: MenuProductPropertiesExpandedTableComponent;
  let fixture: ComponentFixture<MenuProductPropertiesExpandedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuProductPropertiesExpandedTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuProductPropertiesExpandedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
