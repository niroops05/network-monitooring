import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">Network Devices</h5>
        <button class="btn btn-primary" (click)="openAddDeviceModal()">Add Device</button>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>IP Address</th>
                <th>Type</th>
                <th>Status</th>
                <th>Last Seen</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let device of devices">
                <td>
                  <a [routerLink]="['/devices', device._id]">{{ device.name }}</a>
                </td>
                <td>{{ device.ip }}</td>
                <td>{{ device.type }}</td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(device.status)">
                    {{ device.status }}
                  </span>
                </td>
                <td>{{ device.lastSeen | date:'medium' }}</td>
                <td>
                  <button class="btn btn-sm btn-danger" (click)="deleteDevice(device._id)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Device Modal -->
    <ng-template #addDeviceModal let-modal>
      <div class="modal-header">
        <h4 class="modal-title">Add New Device</h4>
        <button type="button" class="btn-close" (click)="modal.dismiss()"></button>
      </div>
      <div class="modal-body">
        <form #deviceForm="ngForm">
          <div class="mb-3">
            <label for="deviceName" class="form-label">Device Name</label>
            <input type="text" class="form-control" id="deviceName" name="name" 
                   [(ngModel)]="newDevice.name" required>
          </div>
          <div class="mb-3">
            <label for="deviceIp" class="form-label">IP Address</label>
            <input type="text" class="form-control" id="deviceIp" name="ip" 
                   [(ngModel)]="newDevice.ip" required pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$">
          </div>
          <div class="mb-3">
            <label for="deviceType" class="form-label">Device Type</label>
            <select class="form-select" id="deviceType" name="type" 
                    [(ngModel)]="newDevice.type" required>
              <option value="router">Router</option>
              <option value="switch">Switch</option>
              <option value="server">Server</option>
              <option value="workstation">Workstation</option>
            </select>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="modal.dismiss()">Cancel</button>
        <button type="button" class="btn btn-primary" 
                [disabled]="!deviceForm.form.valid"
                (click)="addDevice()">Add Device</button>
      </div>
    </ng-template>
  `
})
export class DeviceListComponent implements OnInit {
  devices: any[] = [];
  newDevice = {
    name: '',
    ip: '',
    type: 'server'
  };

  constructor(private deviceService: DeviceService) {}

  ngOnInit() {
    this.loadDevices();
  }

  loadDevices() {
    this.deviceService.getDevices().subscribe(devices => {
      this.devices = devices;
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

  openAddDeviceModal() {
    const modalElement = document.getElementById('addDeviceModal');
    if (modalElement) {
      // @ts-ignore
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  addDevice() {
    this.deviceService.addDevice(this.newDevice).subscribe(() => {
      const modalElement = document.getElementById('addDeviceModal');
      if (modalElement) {
        // @ts-ignore
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
      this.loadDevices();
      this.newDevice = { name: '', ip: '', type: 'server' };
    });
  }

  deleteDevice(id: string) {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.deleteDevice(id).subscribe(() => {
        this.loadDevices();
      });
    }
  }
}