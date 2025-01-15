import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelComapniesComponent } from './admin-panel-comapnies.component';

describe('AdminPanelComapniesComponent', () => {
  let component: AdminPanelComapniesComponent;
  let fixture: ComponentFixture<AdminPanelComapniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPanelComapniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPanelComapniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
