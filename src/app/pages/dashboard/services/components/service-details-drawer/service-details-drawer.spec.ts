import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDetailsDrawer } from './service-details-drawer';

describe('ServiceDetailsDrawer', () => {
  let component: ServiceDetailsDrawer;
  let fixture: ComponentFixture<ServiceDetailsDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDetailsDrawer],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceDetailsDrawer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
