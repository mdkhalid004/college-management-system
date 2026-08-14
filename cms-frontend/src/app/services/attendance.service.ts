import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Attendance {
  attendanceId?: number;
  studentId?: number;
  courseId?: number;
  studentName?: string;
  courseName?: string;
  student?: any;
  course?: any;
  date: string; // YYYY-MM-DD
  status: string; // e.g., 'PRESENT', 'ABSENT'
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/attendances';
  private studentUrl = 'http://localhost:8080/api/v1/students';
  private courseUrl = 'http://localhost:8080/api/v1/courses';

  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }

  getAllAttendances(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addAttendance(data: any): Observable<Attendance> {
    return this.http.post<Attendance>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  updateAttendance(id: number, data: any): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  deleteAttendance(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }

  // Helper methods for dropdowns
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.studentUrl, { headers: this.getHeaders() });
  }

  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.courseUrl, { headers: this.getHeaders() });
  }
}