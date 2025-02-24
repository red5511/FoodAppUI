import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBluetoothComponent } from './settings-bluetooth.component';

describe('SettingsBluetoothComponent', () => {
  let component: SettingsBluetoothComponent;
  let fixture: ComponentFixture<SettingsBluetoothComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsBluetoothComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsBluetoothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
