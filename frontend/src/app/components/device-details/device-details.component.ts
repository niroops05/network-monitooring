import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeviceService } from '../../services/device.service';
import { WebSocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
  template: `
    <div class="card" *ngIf="device">
      <div class="card-header">
        <h5 class="card-title mb-0">{{ device.name }}</h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h6>Device Information</h6>
            <dl class="row">
              <dt class="col-sm-4">IP Address</dt>
              <dd class="col-sm-8">{{ device.ip }}</dd>

              <dt class="col-sm-4">Type</dt>
              <dd class="col-sm-8">{{ device.type }}</dd>

              <dt class="col-sm-4">Status</dt>
              <dd class="col-sm-8">
                <span class="badge" [ngClass]="getStatusClass(device.status)">
                  {{ device.status }}
                </span>
              </dd>

              <dt class="col-sm-4">Last Seen</dt>
              <dd class="col-sm-8">{{ device.lastSeen | date:'medium' }}</dd>
            </dl>
          </div>
          <div class="col-md-6">
            <h6>Performance Metrics</h6>
            <dl class="row">
              <dt class="col-sm-4">CPU Usage</dt>
              <dd class="col-sm-8">
                <div class="progress">
                  <div class="progress-bar" role="progressbar" 
                       [style.width.%]="device.metrics?.cpu"
                       [ngClass]="getMetricClass(device.metrics?.cpu)">
                    {{ device.metrics?.cpu }}%
                  </div>
                </div>
              </dd>

              <dt class="col-sm-4">Memory Usage</dt>
              <dd class="col-sm-8">
                <div class="progress">
                  <div class="progress-bar" role="progressbar" 
                       [style.width.%]="device.metrics?.memory"
                       [ngClass]="getMetricClass(device.metrics?.memory)">
                    {{ device.metrics?.memory }}%
                  </div>
                </div>
              </dd>

              <dt class="col-sm-4">Bandwidth</dt>
              <dd class="col-sm-8">{{ device.metrics?.bandwidth }} Mbps</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {
  device: any;
  private deviceId: string = '';
  private wsSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private wsService: WebSocketService
  ) {}

  ngOnInit() {
    this.deviceId = this.route.snapshot.paramMap.get('id') || '';
    this.loadDevice();
    this.setupWebSocket();
  }

  ngOnDestroy() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }

  loadDevice() {
    this.deviceService.getDevice(this.deviceId).subscribe(device => {
      this.device = device;
    });
  }

  setupWebSocket() {
    this.wsSubscription = this.wsService.messages$.subscribe(message => {
      if (message.type === 'deviceUpdate' && message.data._id === this.deviceId) {
        this.device = message.data;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'online': return 'bg-success';
      case 'offline': return 'bg-danger';
      case 'warning': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  getMetricClass(value: number): string {
    if (value >= 90) return 'bg-danger';
    if (value >= 75) return 'bg-warning';
    return 'bg-success';
  }
}