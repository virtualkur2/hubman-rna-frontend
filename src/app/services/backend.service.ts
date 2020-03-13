import { HttpClient, HttpEvent} from '@angular/common/http'
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { BackendMessage } from '../interfaces/backend.message';
import { environment } from '../../environments/environment';
import { SseService } from './sse.service';
@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor( private http: HttpClient, private _zone: NgZone, private _sseService: SseService ) { }

  private algorithmsUrl = `${environment.baseURL}/${environment.apiURL}/algorithms`;
  private trainfileUrl = `${environment.baseURL}/${environment.apiURL}/train/file`;

  getAlgorithms(): Observable<BackendMessage> {
    return this.http.get<BackendMessage>(this.algorithmsUrl);
  }

  postFormData(form: FormData): Observable<HttpEvent<BackendMessage>> {
    return this.http.post<BackendMessage>(this.trainfileUrl, form, {
      responseType: 'json',
      reportProgress: true,
      observe: 'events'
    })
  }

  getResults(full_url: string) {
    const url = `${environment.baseURL}${full_url}`;
    return Observable.create(observer => {
      const eventSource = this._sseService.getEventSource(url);

      eventSource.onmessage = message => {
        console.log('message received');
        const data = JSON.parse(message.data);
        if(data.error) {
          this._zone.run(() => {
            observer.error(data);
            eventSource.close();
          });
        } else if(data.state === 'WORKING' || data.state === 'PENDING' || data.state === 'SUCCESS') {
          this._zone.run(() => {
            observer.next(data);
            if(data.state === 'SUCCESS') eventSource.close();
          });
        } else {
          this._zone.run(() => {
            observer.error(new ErrorEvent('Unknown work state'));
            eventSource.close();
          });
        }
      }

      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
          eventSource.close();
        });
      }
    });
  }
}
