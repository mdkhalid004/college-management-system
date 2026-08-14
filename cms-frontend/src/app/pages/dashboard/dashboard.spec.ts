import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard'; // Error yahan tha, maine path theek kar diya hai

describe('Dashboard', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent], // Angular 22 mein standalone components sidhe import hote hain
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});