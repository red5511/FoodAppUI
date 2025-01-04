import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastWebsocketComponent } from './toast-websocket.component';

describe('ToastWebsocketComponent', () => {
  let component: ToastWebsocketComponent;
  let fixture: ComponentFixture<ToastWebsocketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastWebsocketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastWebsocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
