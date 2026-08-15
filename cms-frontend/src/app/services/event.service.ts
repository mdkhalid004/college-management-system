import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  eventId?: number;
  eventName: string;
  description: string;
  eventDate: string; 
  eventTime: string; 
  venue: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = 'https://college-management-system-2qa4.onrender.com/api/v1/events';

  private tempToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bC5zaGFybWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODUzMzIxMDEsImV4cCI6MTc4NzkyNDEwMX0.E6RAFfQe83wmdazz4AMUrqwXZPKv76sxCxLpfg8uS4wYrsrcdx4tw19pHdpVIQkp';

  private getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.tempToken}`);
  }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addEvent(eventData: any): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, eventData, { headers: this.getHeaders() });
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateEvent(id: number, eventData: any): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, eventData, { headers: this.getHeaders() });
  }

  deleteEvent(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' as 'json' 
    }) as Observable<string>;
  }
}