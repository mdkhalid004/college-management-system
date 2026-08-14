import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  studentId?: number;
  userId?: number; 
  firstName: string;
  lastName: string;
  enrollmentNumber: string;
  fatherName: string;
  motherName: string;
  gender: string; 
  dob: string; 
  mobile: string;
  address: string;
  departmentId?: number; 
  courseId?: number;
  semester: number;
  admissionDate: string; 
  feeStatus: string; 
  photo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  
  // Base URLs (Agar apke backend me department/course ka URL alag hai to yahan change kar lena)
  private apiUrl = 'http://localhost:8080/api/v1/students';
  private deptUrl = 'http://localhost:8080/api/v1/departments'; 
  private courseUrl = 'http://localhost:8080/api/v1/courses';

  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addStudent(studentData: any) {
    return this.http.post(this.apiUrl, studentData, { headers: this.getHeaders() });
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student, { headers: this.getHeaders() });
  }

  deleteStudent(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // 🔴 NAYE API CALLS: Dropdowns ko dynamic banane ke liye
  getAllDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.deptUrl, { headers: this.getHeaders() });
  }

  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.courseUrl, { headers: this.getHeaders() });
  }
}