import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdvertisementModal } from './add-advertisement-modal';

describe('AddAdvertisementModal', () => {
  let component: AddAdvertisementModal;
  let fixture: ComponentFixture<AddAdvertisementModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAdvertisementModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAdvertisementModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
