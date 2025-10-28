import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = `${environment.apiUrl}/api/devices`;

  constructor(private http: HttpClient) {}

  getDevices(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getDevice(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addDevice(device: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, device);
  }

  updateDeviceStatus(id: string, status: string, metrics?: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status, metrics });
  }

  deleteDevice(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}