import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesComponent } from './fees';

describe('Fees', () => {
  let component: FeesComponent;
  let fixture: ComponentFixture<FeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
