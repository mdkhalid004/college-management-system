import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Library {
  bookId?: number;
  name: string;
  author: string;
  isbn: string;
  issueDate?: string;
  returnDate?: string;
  fine: number;
}

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private http = inject(HttpClient);
  private apiUrl = 'https://college-management-system-2qa4.onrender.com/api/v1/library';

  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }

  getAllLibraryRecords(): Observable<Library[]> {
    return this.http.get<Library[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addLibraryRecord(libraryData: any): Observable<Library> {
    return this.http.post<Library>(this.apiUrl, libraryData, { headers: this.getHeaders() });
  }

  getLibraryRecordById(id: number): Observable<Library> {
    return this.http.get<Library>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateLibraryRecord(id: number, libraryData: any): Observable<Library> {
    return this.http.put<Library>(`${this.apiUrl}/${id}`, libraryData, { headers: this.getHeaders() });
  }

  deleteLibraryRecord(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }
}