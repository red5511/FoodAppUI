import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchWithDialogComponent } from './switch-with-dialog.component';

describe('SwitchWithDialogComponent', () => {
  let component: SwitchWithDialogComponent;
  let fixture: ComponentFixture<SwitchWithDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SwitchWithDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchWithDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
