import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {baseUrl} from './baseUrl';
@Injectable({
  providedIn: 'root'
})

export class ApiService {
  
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {
    console.log("Expecting Api at " + baseUrl+"/api");
   }

  // Create
  createRoom(data): Observable<any> {
    let url = `${baseUrl}/api/room`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all users
  getRooms() {
    return this.http.get(`${baseUrl}/api/room`);
  }

  // Get user
  getRoom(id): Observable<any> {
    let url = `${baseUrl}/api/room/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Update user
  updateRoom(id,data): Observable<any> {
    let url = `${baseUrl}/api/room/${id}`;
    return this.http.put(url,data, {headers: this.headers}).pipe(
      map((res: Response) => {
        console.log("response:")
        console.log(res);
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  /* deleteRoom(id): Observable<any> {
    let url = `${baseUrl}/api/room/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  } */

  // Error handling 
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  // Get all users
  adminGetRooms(pw:string) {
    return this.http.get(`${baseUrl}/api/admin/room`,{
      params:{
        pw: pw
      }
    });
  }

  adminDeleteRoom(id,pw): Observable<any> {
    let url = `${baseUrl}/api/room/${id}`;
    return this.http.delete(url, { headers: this.headers, params:{pw:pw} }).pipe(
      catchError(this.errorMgmt)
    )
  }
}