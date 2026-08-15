import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Course {
  courseId?: number;
  name: string;
  departmentName?: string; 
  department?: any; 
  duration: string;
  totalFees: number;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'https://college-management-system-2qa4.onrender.com/api/v1/courses';
  private deptUrl = 'https://college-management-system-2qa4.onrender.com/api/v1/departments'; 
  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  addCourse(courseData: any): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, courseData, { headers: this.getHeaders() });
  }
  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  updateCourse(id: number, course: any): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course, { headers: this.getHeaders() });
  }
  deleteCourse(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }
  getAllDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.deptUrl, { headers: this.getHeaders() });
  }
}