import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class TrService {
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  server: string = "server";
  
  constructor(private http: HttpClient) { }

  getAllTimeEntriesLast7Days(dateStrArray: string): Observable<any> {
    let getUrl = this.server + "/getAllTimeEntriesLast7Days";
    const opts = {
      params: new HttpParams().append('username', 'a1')
        .append('dateStrArray', dateStrArray)
    };
    return this.http.get(getUrl, opts);
  }
}
