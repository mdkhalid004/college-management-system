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
  
  // 1. Login Page (Standalone - No Sidebar/Navbar)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 2. Default redirection to login page
  { path: '', redirectTo: 'login', pathMatch: 'full' },


  // 3. Main Dashboard Layout (Secured with AuthGuard - Sidebar & Navbar included)
  {
    path: '',
    component: DashboardComponent, 
    canActivate: [authGuard], // Yeh guard iske saare child routes ko protect kar dega
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

  // 4. Wildcard Route (Agar koi galat URL dale toh login par bhej do)
  { path: '**', redirectTo: 'login' }
];