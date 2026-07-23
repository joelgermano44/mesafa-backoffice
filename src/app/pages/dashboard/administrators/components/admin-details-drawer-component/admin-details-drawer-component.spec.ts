import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetailsDrawerComponent } from './admin-details-drawer-component';

describe('AdminDetailsDrawerComponent', () => {
  let component: AdminDetailsDrawerComponent;
  let fixture: ComponentFixture<AdminDetailsDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDetailsDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDetailsDrawerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
