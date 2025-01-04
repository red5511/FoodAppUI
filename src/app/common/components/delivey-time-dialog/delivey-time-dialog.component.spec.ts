import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveyTimeDialogComponent } from './delivey-time-dialog.component';

describe('DeliveyTimeDialogComponent', () => {
  let component: DeliveyTimeDialogComponent;
  let fixture: ComponentFixture<DeliveyTimeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveyTimeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveyTimeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
