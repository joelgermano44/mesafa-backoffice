import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalsTable } from './professionals-table';

describe('ProfessionalsTable', () => {
  let component: ProfessionalsTable;
  let fixture: ComponentFixture<ProfessionalsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessionalsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
