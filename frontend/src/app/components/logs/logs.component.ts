import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">System Logs</h5>
        <div class="btn-group">
          <button type="button" class="btn" [class]="getFilterButtonClass('all')"
                  (click)="setFilter('all')">All</button>
          <button type="button" class="btn" [class]="getFilterButtonClass('error')"
                  (click)="setFilter('error')">Errors</button>
          <button type="button" class="btn" [class]="getFilterButtonClass('warning')"
                  (click)="setFilter('warning')">Warnings</button>
          <button type="button" class="btn" [class]="getFilterButtonClass('info')"
                  (click)="setFilter('info')">Info</button>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Device</th>
                <th>Type</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of filteredLogs">
                <td>{{ log.createdAt | date:'medium' }}</td>
                <td>
                  <a [routerLink]="['/devices', log.device._id]">
                    {{ log.device.name }}
                  </a>
                </td>
                <td>
                  <span class="badge" [ngClass]="getTypeClass(log.type)">
                    {{ log.type }}
                  </span>
                </td>
                <td>{{ log.message }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <div>
            <select class="form-select" [(ngModel)]="pageSize" (change)="loadLogs()">
              <option [value]="25">25 per page</option>
              <option [value]="50">50 per page</option>
              <option [value]="100">100 per page</option>
            </select>
          </div>
          <ngb-pagination
            [collectionSize]="totalLogs"
            [(page)]="currentPage"
            [pageSize]="pageSize"
            (pageChange)="loadLogs()"
          ></ngb-pagination>
        </div>
      </div>
    </div>
  `
})
export class LogsComponent implements OnInit {
  logs: any[] = [];
  currentFilter: 'all' | 'error' | 'warning' | 'info' = 'all';
  currentPage = 1;
  pageSize = 50;
  totalLogs = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadLogs();
  }

  get filteredLogs() {
    if (this.currentFilter === 'all') return this.logs;
    return this.logs.filter(log => log.type === this.currentFilter);
  }

  loadLogs() {
    const url = `${environment.apiUrl}/api/logs`;
    const params = {
      page: this.currentPage.toString(),
      limit: this.pageSize.toString()
    };

    this.http.get<any>(url, { params }).subscribe(response => {
      this.logs = response.logs;
      this.totalLogs = response.total;
    });
  }

  setFilter(filter: 'all' | 'error' | 'warning' | 'info') {
    this.currentFilter = filter;
  }

  getFilterButtonClass(filter: string): string {
    return filter === this.currentFilter ? 'btn-primary' : 'btn-outline-primary';
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'error': return 'bg-danger';
      case 'warning': return 'bg-warning text-dark';
      case 'info': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  }
}