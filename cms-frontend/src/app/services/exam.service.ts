import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Exam {
  examId?: number;
  name: string;
  courseId?: number;
  courseName?: string;
  course?: any;
  examDate: string;
  examTime: string;
  roomNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/exams';
  private courseUrl = 'http://localhost:8080/api/v1/courses';

  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }

  getAllExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addExam(examData: any): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, examData, { headers: this.getHeaders() });
  }

  getExamById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateExam(id: number, examData: any): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${id}`, examData, { headers: this.getHeaders() });
  }

  deleteExam(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }
  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.courseUrl, { headers: this.getHeaders() });
  }
}