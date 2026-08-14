import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableComponent } from './timetable';

describe('Timetable', () => {
  let component: TimetableComponent;
  let fixture: ComponentFixture<TimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimetableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
