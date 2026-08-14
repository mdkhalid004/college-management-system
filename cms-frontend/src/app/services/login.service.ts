import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  saveAvatar(avatar: string): void {
    if (avatar) {
      localStorage.setItem('adminAvatar', avatar);
    }
  }

  getAvatar(): string | null {
    return localStorage.getItem('adminAvatar');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminAvatar');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}