import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

interface WebSocketMessage {
  type: 'deviceUpdate' | 'newAlert' | 'logUpdate';
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<WebSocketMessage>;
  public messages$: Observable<WebSocketMessage>;

  constructor() {
    this.socket$ = webSocket(`${environment.wsUrl}`);
    this.messages$ = this.socket$.pipe(share());
  }

  sendMessage(message: WebSocketMessage): void {
    this.socket$.next(message);
  }

  close(): void {
    this.socket$.complete();
  }
}