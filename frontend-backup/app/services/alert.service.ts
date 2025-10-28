import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private apiUrl = `${environment.apiUrl}/api/alerts`;

  constructor(private http: HttpClient) {}

  getAlerts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getActiveAlerts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?status=active`);
  }

  createAlert(alert: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, alert);
  }

  acknowledgeAlert(id: string, user: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/acknowledge`, { user });
  }

  resolveAlert(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/resolve`, {});
  }
}