import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Fees Interface jo Entity/DTO se match karti hai
export interface Fees {
  receiptId?: number;
  receiptNo: string;
  studentId?: number;
  studentName?: string; // Table display ke liye
  student?: any;        // Nested Student object handle karne ke liye
  totalFees: number;
  paidAmount: number;
  dueAmount: number;
  paymentDate: string;  // YYYY-MM-DD
  paymentMode: string;  // CASH, UPI, CARD, BANK_TRANSFER etc.
  transactionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeesService {
  private http = inject(HttpClient);
  
  // Base URLs for Fees & Student API
  private apiUrl = 'http://localhost:8080/api/v1/fees';
  private studentUrl = 'http://localhost:8080/api/v1/students'; 

  // JWT Token header
  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }

  // GET ALL FEES RECORDS
  getAllFees(): Observable<Fees[]> {
    return this.http.get<Fees[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // ADD NEW FEES RECEIPT
  addFees(feesData: any): Observable<Fees> {
    return this.http.post<Fees>(this.apiUrl, feesData, { headers: this.getHeaders() });
  }

  // GET FEES RECORD BY ID
  getFeesById(id: number): Observable<Fees> {
    return this.http.get<Fees>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // UPDATE FEES RECORD
  updateFees(id: number, feesData: any): Observable<Fees> {
    return this.http.put<Fees>(`${this.apiUrl}/${id}`, feesData, { headers: this.getHeaders() });
  }

  // DELETE FEES RECORD
  deleteFees(id: number): Observable<string> {
    // Backend se string response aane ki wajah se responseType 'text' rakha hai
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }

  // Fees form mein Student Dropdown ko fill karne ke liye API call
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.studentUrl, { headers: this.getHeaders() });
  }
}