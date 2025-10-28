import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services/alert.service';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">Alert Management</h5>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <div class="btn-group" role="group">
            <button type="button" class="btn" [class]="getFilterButtonClass('all')"
                    (click)="setFilter('all')">All</button>
            <button type="button" class="btn" [class]="getFilterButtonClass('active')"
                    (click)="setFilter('active')">Active</button>
            <button type="button" class="btn" [class]="getFilterButtonClass('acknowledged')"
                    (click)="setFilter('acknowledged')">Acknowledged</button>
            <button type="button" class="btn" [class]="getFilterButtonClass('resolved')"
                    (click)="setFilter('resolved')">Resolved</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Device</th>
                <th>Severity</th>
                <th>Message</th>
                <th>Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let alert of filteredAlerts">
                <td>
                  <a [routerLink]="['/devices', alert.device._id]">
                    {{ alert.device.name }}
                  </a>
                </td>
                <td>
                  <span class="badge" [ngClass]="getSeverityClass(alert.severity)">
                    {{ alert.severity }}
                  </span>
                </td>
                <td>{{ alert.message }}</td>
                <td>{{ alert.status }}</td>
                <td>{{ alert.createdAt | date:'medium' }}</td>
                <td>
                  <button *ngIf="alert.status === 'active'"
                          class="btn btn-sm btn-warning me-2"
                          (click)="acknowledgeAlert(alert._id)">
                    Acknowledge
                  </button>
                  <button *ngIf="alert.status !== 'resolved'"
                          class="btn btn-sm btn-success"
                          (click)="resolveAlert(alert._id)">
                    Resolve
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AlertsComponent implements OnInit {
  alerts: any[] = [];
  currentFilter: 'all' | 'active' | 'acknowledged' | 'resolved' = 'active';

  constructor(
    private alertService: AlertService,
    private wsService: WebSocketService
  ) {}

  ngOnInit() {
    this.loadAlerts();
    this.setupWebSocket();
  }

  get filteredAlerts() {
    if (this.currentFilter === 'all') return this.alerts;
    return this.alerts.filter(alert => alert.status === this.currentFilter);
  }

  loadAlerts() {
    this.alertService.getAlerts().subscribe(alerts => {
      this.alerts = alerts;
    });
  }

  setupWebSocket() {
    this.wsService.messages$.subscribe(message => {
      if (message.type === 'newAlert') {
        this.alerts.unshift(message.data);
      }
    });
  }

  setFilter(filter: 'all' | 'active' | 'acknowledged' | 'resolved') {
    this.currentFilter = filter;
  }

  getFilterButtonClass(filter: string): string {
    return filter === this.currentFilter ? 'btn-primary' : 'btn-outline-primary';
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'critical': return 'bg-danger';
      case 'high': return 'bg-warning text-dark';
      case 'medium': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  }

  acknowledgeAlert(id: string) {
    this.alertService.acknowledgeAlert(id, 'current-user').subscribe(() => {
      this.loadAlerts();
    });
  }

  resolveAlert(id: string) {
    this.alertService.resolveAlert(id).subscribe(() => {
      this.loadAlerts();
    });
  }
}