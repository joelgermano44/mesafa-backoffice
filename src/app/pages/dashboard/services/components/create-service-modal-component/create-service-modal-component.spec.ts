import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServiceModalComponent } from './create-service-modal-component';

describe('CreateServiceModalComponent', () => {
  let component: CreateServiceModalComponent;
  let fixture: ComponentFixture<CreateServiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateServiceModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateServiceModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
