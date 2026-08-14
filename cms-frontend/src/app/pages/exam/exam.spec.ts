import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamComponent } from './exam';

describe('Exam', () => {
  let component: ExamComponent;
  let fixture: ComponentFixture<ExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
