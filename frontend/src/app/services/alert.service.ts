import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface Alert {
  _id: string;
  device: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private apiUrl = `${environment.apiUrl}/api/alerts`;

  private httpOptions = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  constructor(private http: HttpClient) {}

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(this.apiUrl, this.httpOptions);
  }

  getActiveAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}?status=active`, this.httpOptions);
  }

  acknowledgeAlert(id: string, user: string): Observable<Alert> {
    return this.http.patch<Alert>(`${this.apiUrl}/${id}/acknowledge`, { user });
  }

  resolveAlert(id: string): Observable<Alert> {
    return this.http.patch<Alert>(`${this.apiUrl}/${id}/resolve`, {});
  }
}