import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalDepartments: number;
}

export interface RecentActivity {
  icon: string;
  message: string;
  time: string;
}

export interface UpcomingEvent {
  title: string;
  schedule: string;
}

export interface MonthlyData {
  month: string;
  totalValue: number;
}

export interface SearchResultDto {
  category: string;
  title: string;
  subtitle: string;
  redirectUrl: string;
}

export interface AdminProfileDto {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
export interface Settings {
  id?: number;
  isDarkMode: boolean;
  academicYear: string;
}
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = 'https://college-management-system-2qa4.onrender.com/api/v1/dashboard';
  private searchUrl = 'https://college-management-system-2qa4.onrender.com/api/search';
  private adminUrl = 'https://college-management-system-2qa4.onrender.com/api/v1/admin';
  private settingsUrl = 'https://college-management-system-2qa4.onrender.com/api/settings'; 

  getStats(): Observable<DashboardStats> { 
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`); 
  }

  getRecentActivities(): Observable<RecentActivity[]> { 
    return this.http.get<RecentActivity[]>(`${this.baseUrl}/recent-activities`); 
  }

  getUpcomingEvents(): Observable<UpcomingEvent[]> { 
    return this.http.get<UpcomingEvent[]>(`${this.baseUrl}/upcoming-events`); 
  }

  getMonthlyFees(): Observable<MonthlyData[]> {
    return this.http.get<MonthlyData[]>(`${this.baseUrl}/monthly-fees`);
  }

  getMonthlyAttendance(): Observable<MonthlyData[]> {
    return this.http.get<MonthlyData[]>(`${this.baseUrl}/monthly-attendance`);
  }
  searchGlobal(query: string): Observable<SearchResultDto[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<SearchResultDto[]>(this.searchUrl, { params });
  }
  getAdminProfile(): Observable<AdminProfileDto> {
    return this.http.get<AdminProfileDto>(`${this.adminUrl}/profile`);
  }

  updateAdminProfile(profileData: AdminProfileDto): Observable<AdminProfileDto> {
    return this.http.put<AdminProfileDto>(`${this.adminUrl}/profile`, profileData);
  }

  changePassword(passwordData: ChangePasswordDto): Observable<any> {
    return this.http.put(`${this.adminUrl}/change-password`, passwordData);
  }
  getSettings(): Observable<Settings> {
    return this.http.get<Settings>(this.settingsUrl);
  }

  updateSettings(settingsData: Settings): Observable<Settings> {
    return this.http.put<Settings>(this.settingsUrl, settingsData);
  }
}