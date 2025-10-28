import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface Device {
  _id: string;
  name: string;
  ip: string;
  type: string;
  status: string;
  lastSeen: Date;
  metrics?: {
    cpu: number;
    memory: number;
    bandwidth: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = `${environment.apiUrl}/api/devices`;

  private httpOptions = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  constructor(private http: HttpClient) {}

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl, this.httpOptions);
  }

  getDevice(id: string): Observable<Device> {
    return this.http.get<Device>(`${this.apiUrl}/${id}`);
  }

  addDevice(device: Partial<Device>): Observable<Device> {
    return this.http.post<Device>(this.apiUrl, device);
  }

  updateDeviceStatus(id: string, status: string, metrics?: any): Observable<Device> {
    return this.http.patch<Device>(`${this.apiUrl}/${id}/status`, { status, metrics });
  }

  deleteDevice(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}