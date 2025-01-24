import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductTwoPagePanelComponent } from './new-product-two-page-panel.component';

describe('NewProductTwoPagePanelComponent', () => {
  let component: NewProductTwoPagePanelComponent;
  let fixture: ComponentFixture<NewProductTwoPagePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewProductTwoPagePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProductTwoPagePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
