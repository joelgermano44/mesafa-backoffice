import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsUsers } from './clients-users';

describe('ClientsUsers', () => {
  let component: ClientsUsers;
  let fixture: ComponentFixture<ClientsUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsUsers],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
