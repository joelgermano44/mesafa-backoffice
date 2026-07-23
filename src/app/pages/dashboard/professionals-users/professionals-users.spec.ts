import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalsUsers } from './professionals-users';

describe('ProfessionalsUsers', () => {
  let component: ProfessionalsUsers;
  let fixture: ComponentFixture<ProfessionalsUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalsUsers],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessionalsUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
