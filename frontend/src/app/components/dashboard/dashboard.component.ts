import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeviceService } from '../../services/device.service';
import { AlertService } from '../../services/alert.service';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
  template: `
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Device Status Overview</h5>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col">
                <h3>{{ deviceStats.total }}</h3>
                <p>Total Devices</p>
              </div>
              <div class="col">
                <h3>{{ deviceStats.online }}</h3>
                <p class="text-success">Online</p>
              </div>
              <div class="col">
                <h3>{{ deviceStats.offline }}</h3>
                <p class="text-danger">Offline</p>
              </div>
              <div class="col">
                <h3>{{ deviceStats.warning }}</h3>
                <p class="text-warning">Warning</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Active Alerts</h5>
          </div>
          <div class="card-body">
            <div *ngFor="let alert of activeAlerts" class="alert" [ngClass]="getAlertClass(alert.severity)">
              {{ alert.message }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Recent Devices</h5>
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>IP</th>
                  <th>Status</th>
                  <th>Last Seen</th>
                  <th>CPU</th>
                  <th>Memory</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let device of recentDevices">
                  <td>{{ device.name }}</td>
                  <td>{{ device.ip }}</td>
                  <td>
                    <span class="badge" [ngClass]="getStatusClass(device.status)">
                      {{ device.status }}
                    </span>
                  </td>
                  <td>{{ device.lastSeen | date:'medium' }}</td>
                  <td>{{ device.metrics?.cpu }}%</td>
                  <td>{{ device.metrics?.memory }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  deviceStats = {
    total: 0,
    online: 0,
    offline: 0,
    warning: 0
  };

  activeAlerts: any[] = [];
  recentDevices: any[] = [];

  constructor(
    private deviceService: DeviceService,
    private alertService: AlertService,
    private wsService: WebSocketService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.setupWebSocket();
  }

  loadDashboardData() {
    this.deviceService.getDevices().subscribe(devices => {
      this.recentDevices = devices.slice(0, 5);
      this.calculateDeviceStats(devices);
    });

    this.alertService.getActiveAlerts().subscribe(alerts => {
      this.activeAlerts = alerts.slice(0, 5);
    });
  }

  setupWebSocket() {
    this.wsService.messages$.subscribe(message => {
      if (message.type === 'deviceUpdate') {
        this.updateDeviceStats(message.data);
      } else if (message.type === 'newAlert') {
        this.handleNewAlert(message.data);
      }
    });
  }

  calculateDeviceStats(devices: any[]) {
    this.deviceStats.total = devices.length;
    this.deviceStats.online = devices.filter(d => d.status === 'online').length;
    this.deviceStats.offline = devices.filter(d => d.status === 'offline').length;
    this.deviceStats.warning = devices.filter(d => d.status === 'warning').length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'online': return 'bg-success';
      case 'offline': return 'bg-danger';
      case 'warning': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  getAlertClass(severity: string): string {
    switch (severity) {
      case 'critical': return 'alert-danger';
      case 'high': return 'alert-warning';
      case 'medium': return 'alert-info';
      default: return 'alert-secondary';
    }
  }

  private updateDeviceStats(device: any) {
    const index = this.recentDevices.findIndex(d => d._id === device._id);
    if (index !== -1) {
      this.recentDevices[index] = device;
    }
  }

  private handleNewAlert(alert: any) {
    this.activeAlerts.unshift(alert);
    if (this.activeAlerts.length > 5) {
      this.activeAlerts.pop();
    }
  }
}