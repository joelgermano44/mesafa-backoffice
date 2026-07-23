import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAdminModalComponent } from './register-admin-modal-component';

describe('RegisterAdminModalComponent', () => {
  let component: RegisterAdminModalComponent;
  let fixture: ComponentFixture<RegisterAdminModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAdminModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterAdminModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
