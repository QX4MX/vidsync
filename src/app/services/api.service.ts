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
    console.log("Expecting Api at " + baseUrl);
   }

  // Create
  createUser(data): Observable<any> {
    let url = `${baseUrl}/api/users/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all users
  getUsers() {
    return this.http.get(`${baseUrl}/api/users/`);
  }

  // Get user
  getUser(id): Observable<any> {
    let url = `${baseUrl}/api/users/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Update user
  updateUser(id, data): Observable<any> {
    let url = `${baseUrl}/api/users/update/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete user
  deleteUser(id): Observable<any> {
    let url = `${baseUrl}/api/users/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
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

  // Delete user
  deleteRoom(id): Observable<any> {
    let url = `${baseUrl}/api/room/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

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

}