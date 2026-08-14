import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Timetable {
  timetableId?: number;
  departmentId?: number;
  departmentName?: string;
  semester: string;
  courseId?: number;
  courseName?: string;
  teacherId?: number;
  teacherName?: string;
  dayOfWeek: string;
  classTime: string;
  roomNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/timetable';
  private departmentUrl = 'http://localhost:8080/api/v1/departments';
  private courseUrl = 'http://localhost:8080/api/v1/courses';
  private teacherUrl = 'http://localhost:8080/api/v1/teachers'; 

  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }
  getAllTimetables(): Observable<Timetable[]> {
    return this.http.get<Timetable[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addTimetable(timetableData: any): Observable<Timetable> {
    return this.http.post<Timetable>(this.apiUrl, timetableData, { headers: this.getHeaders() });
  }

  updateTimetable(id: number, timetableData: any): Observable<Timetable> {
    return this.http.put<Timetable>(`${this.apiUrl}/${id}`, timetableData, { headers: this.getHeaders() });
  }

  deleteTimetable(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }
  getAllDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.departmentUrl, { headers: this.getHeaders() });
  }

  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.courseUrl, { headers: this.getHeaders() });
  }

  getAllTeachers(): Observable<any[]> {
    return this.http.get<any[]>(this.teacherUrl, { headers: this.getHeaders() });
  }
}