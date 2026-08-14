import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Course Interface jo Entity/DTO se match karti hai
export interface Course {
  courseId?: number;
  name: string;
  departmentName?: string; // 👈 Ye add karo
  department?: any; // Backend DTO ke hisaab se departmentId
  duration: string;
  totalFees: number;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  
  // Base URLs
  private apiUrl = 'http://localhost:8080/api/v1/courses';
  private deptUrl = 'http://localhost:8080/api/v1/departments'; 

  // JWT Token header
  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }

  // GET ALL COURSES
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // ADD COURSE
  addCourse(courseData: any): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, courseData, { headers: this.getHeaders() });
  }

  // GET COURSE BY ID
  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // UPDATE COURSE
  updateCourse(id: number, course: any): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course, { headers: this.getHeaders() });
  }

  // DELETE COURSE
  deleteCourse(id: number): Observable<string> {
    // String response ke liye responseType 'text' rakha hai taaki Angular parsing error na de
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }

  // Course form mein Department Dropdown dynamic banane ke liye
  getAllDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.deptUrl, { headers: this.getHeaders() });
  }
}