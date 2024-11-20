import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderPanelComponent } from './new-order-panel.component';

describe('NewOrderPanelComponent', () => {
  let component: NewOrderPanelComponent;
  let fixture: ComponentFixture<NewOrderPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewOrderPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewOrderPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
