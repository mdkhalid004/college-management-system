import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Result {
  resultId?: number;
  studentId?: number;
  courseId?: number;
  studentName?: string; 
  courseName?: string;
  student?: any;
  course?: any;
  marks: number;
  grade: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/results';
  private studentUrl = 'http://localhost:8080/api/v1/students';
  private courseUrl = 'http://localhost:8080/api/v1/courses';

  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }

  getAllResults(): Observable<Result[]> {
    return this.http.get<Result[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addResult(resultData: any): Observable<Result> {
    return this.http.post<Result>(this.apiUrl, resultData, { headers: this.getHeaders() });
  }

  updateResult(id: number, resultData: any): Observable<Result> {
    return this.http.put<Result>(`${this.apiUrl}/${id}`, resultData, { headers: this.getHeaders() });
  }

  deleteResult(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }

  // Dropdowns ke liye helper methods
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.studentUrl, { headers: this.getHeaders() });
  }

  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.courseUrl, { headers: this.getHeaders() });
  }
}