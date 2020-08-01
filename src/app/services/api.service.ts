import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { baseUrl } from './baseUrl';
import { User } from '../model/user';
@Injectable({
    providedIn: 'root'
})

export class ApiService {
    headers = new HttpHeaders();
    user;
    token;
    constructor(private http: HttpClient) {
        console.log("Expecting Api at " + baseUrl + "/api");
        this.headers.set('Content-Type', 'application/json');
        this.token = localStorage.getItem('jwtToken');
        if (this.token) {
            this.getProfile();
        }
        else {
            this.createToken();
        }
    }

    async createToken() {
        this.http.get(`${baseUrl}/api/user/new`).subscribe((res: any) => {
            this.token = localStorage.setItem('jwtToken', res.token);
            console.log(res);
        });
    }

    async getProfile() {
        if (this.token) {
            const header = { Authorization: this.token };
            this.http.get(`${baseUrl}/api/user/auth`, { headers: header }).subscribe((res: any) => {
                console.log(res);
                if (res.success) {
                    console.log(res);
                }
                else {
                    this.createToken();
                }
            });
        }
    }

    // Create
    async createRoom() {
        if (this.token) {
            const header = { Authorization: this.token };
            return this.http.get(`${baseUrl}/api/room/create`, { headers: header });
        }
    }

    getRoom(id): Observable<any> {
        console.log("get room " + id);
        let url = `${baseUrl}/api/room/${id}`;
        return this.http.get(url, { headers: this.headers });
    }


    updateRoom(id, data): Observable<any> {
        let url = `${baseUrl}/api/room/${id}`;
        return this.http.put(url, data, { headers: this.headers });
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