import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Teacher {
  teacherId?: number;
  userId?: number; 
  name: string;
  phone: string;
  departmentId?: number; 
  subject: string;
  qualification: string; 
  salary: number;        
  joiningDate: string; 
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/teachers';
  private deptUrl = 'http://localhost:8080/api/v1/departments'; 
  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }

  getAllTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addTeacher(teacherData: any) {
    return this.http.post(this.apiUrl, teacherData, { headers: this.getHeaders() });
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateTeacher(id: number, teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/${id}`, teacher, { headers: this.getHeaders() });
  }

  deleteTeacher(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }
  getAllDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.deptUrl, { headers: this.getHeaders() });
  }
}