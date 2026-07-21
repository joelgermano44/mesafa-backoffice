import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeOffer } from './we-offer';

describe('WeOffer', () => {
  let component: WeOffer;
  let fixture: ComponentFixture<WeOffer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeOffer],
    }).compileComponents();

    fixture = TestBed.createComponent(WeOffer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
