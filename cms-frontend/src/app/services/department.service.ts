import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Department interface jo backend entity se match kar rahi hai
export interface Department {
  departmentId?: number;
  name: string;
  hod: string;
  totalTeachers?: number;
  totalStudents?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private http = inject(HttpClient);
  
  // Base URL for Department API
  private apiUrl = 'http://localhost:8080/api/v1/departments';

  // Wahi same token jo pichle module mein chal raha tha
  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }

  // GET ALL
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // CREATE
  addDepartment(departmentData: any) {
    return this.http.post(this.apiUrl, departmentData, { headers: this.getHeaders() });
  }

  // GET BY ID
  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // UPDATE
  updateDepartment(id: number, department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, department, { headers: this.getHeaders() });
  }

  // DELETE
  deleteDepartment(id: number): Observable<string> {
    // Text response handle karne ke liye responseType 'text' rakha hai
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }
}