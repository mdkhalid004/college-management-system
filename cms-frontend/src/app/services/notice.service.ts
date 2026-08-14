import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notice {
  noticeId?: number;
  title: string;
  description: string;
  publishDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/notices';

  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }

  getAllNotices(): Observable<Notice[]> {
    return this.http.get<Notice[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addNotice(noticeData: any): Observable<Notice> {
    return this.http.post<Notice>(this.apiUrl, noticeData, { headers: this.getHeaders() });
  }

  getNoticeById(id: number): Observable<Notice> {
    return this.http.get<Notice>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateNotice(id: number, noticeData: any): Observable<Notice> {
    return this.http.put<Notice>(`${this.apiUrl}/${id}`, noticeData, { headers: this.getHeaders() });
  }

  deleteNotice(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }
}