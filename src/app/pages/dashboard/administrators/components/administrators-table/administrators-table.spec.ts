import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorsTable } from './administrators-table';

describe('CollaboratorsTable', () => {
  let component: AdministratorsTable;
  let fixture: ComponentFixture<AdministratorsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministratorsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
