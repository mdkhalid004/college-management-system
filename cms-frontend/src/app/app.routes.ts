import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login'; 
import { DashboardComponent } from './pages/dashboard/dashboard';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home';
import { StudentComponent } from './pages/student/student';
import { TeacherComponent } from './pages/teacher/teacher';
import { DepartmentComponent } from './pages/department/department';
import { CourseComponent } from './pages/course/course';
import { FeesComponent } from './pages/fees/fees';
import { LibraryComponent } from './pages/library/library';
import { ExamComponent } from './pages/exam/exam';
import { ResultComponent } from './pages/result/result';
import { NoticeComponent } from './pages/notice/notice';
import { EventComponent } from './pages/event/event';
import { AttendanceComponent } from './pages/attendance/attendance';
import { TimetableComponent } from './pages/timetable/timetable';
import { authGuard } from './guards/auth.guard'; 
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: DashboardComponent, 
    canActivate: [authGuard], 
    children: [
    
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'student', component: StudentComponent },
      { path: 'teacher', component: TeacherComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'course', component: CourseComponent },
      { path: 'fees', component: FeesComponent },
      { path: 'library', component: LibraryComponent },
      { path: 'exam', component: ExamComponent },
      { path: 'result', component: ResultComponent },
      { path: 'notice', component: NoticeComponent },
      { path: 'event', component: EventComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'timetable', component: TimetableComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];