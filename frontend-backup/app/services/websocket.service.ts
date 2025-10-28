import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;
  public messages$: Observable<any>;

  constructor() {
    this.socket$ = webSocket(`${environment.wsUrl}`);
    this.messages$ = this.socket$.pipe(share());
  }

  sendMessage(message: any) {
    this.socket$.next(message);
  }
}