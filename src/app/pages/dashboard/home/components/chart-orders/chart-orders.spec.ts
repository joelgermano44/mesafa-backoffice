import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOrders } from './chart-orders';

describe('ChartOrders', () => {
  let component: ChartOrders;
  let fixture: ComponentFixture<ChartOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
