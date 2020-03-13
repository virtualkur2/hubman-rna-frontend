import { Injectable } from '@angular/core';
import { pipe } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  toFormData<T>( formValue: T ) {
    const formData = new FormData();

    for ( const key of Object.keys(formValue) ) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }

  uploadProgress<T>( cb: ( progress: number ) => void ) {
    return tap(( event: HttpEvent<T> ) => {
      if ( event.type === HttpEventType.UploadProgress ) {
        cb(Math.round((100 * event.loaded) / event.total));
      }
    });
  }

  toResponseBody<T>() {
    return pipe(
      filter(( event: HttpEvent<T> ) => event.type === HttpEventType.Response),
      map(( res: HttpResponse<T> ) => res.body)
    );
  }
}
