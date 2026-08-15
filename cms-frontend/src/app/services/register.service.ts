import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'https://college-management-system-2qa4.onrender.com/api/auth';

  constructor(private http: HttpClient) {}

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}