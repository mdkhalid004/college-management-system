import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Fees {
  receiptId?: number;
  receiptNo: string;
  studentId?: number;
  studentName?: string; 
  student?: any;        
  totalFees: number;
  paidAmount: number;
  dueAmount: number;
  paymentDate: string;  
  paymentMode: string;  
  transactionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://college-management-system-2qa4.onrender.com/api/v1/fees';
  private studentUrl = 'https://college-management-system-2qa4.onrender.com/api/v1/students'; 
  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }
  getAllFees(): Observable<Fees[]> {
    return this.http.get<Fees[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  addFees(feesData: any): Observable<Fees> {
    return this.http.post<Fees>(this.apiUrl, feesData, { headers: this.getHeaders() });
  }
  getFeesById(id: number): Observable<Fees> {
    return this.http.get<Fees>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  updateFees(id: number, feesData: any): Observable<Fees> {
    return this.http.put<Fees>(`${this.apiUrl}/${id}`, feesData, { headers: this.getHeaders() });
  }
  deleteFees(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.studentUrl, { headers: this.getHeaders() });
  }
}