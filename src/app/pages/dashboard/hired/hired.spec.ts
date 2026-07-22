import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hired } from './hired';

describe('Hired', () => {
  let component: Hired;
  let fixture: ComponentFixture<Hired>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hired],
    }).compileComponents();

    fixture = TestBed.createComponent(Hired);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
