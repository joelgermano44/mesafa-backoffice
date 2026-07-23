import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Advertisements } from './advertisements';

describe('Advertisements', () => {
  let component: Advertisements;
  let fixture: ComponentFixture<Advertisements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Advertisements],
    }).compileComponents();

    fixture = TestBed.createComponent(Advertisements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
