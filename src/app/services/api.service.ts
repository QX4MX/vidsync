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
            this.token = res.token;
            localStorage.setItem('jwtToken', res.token);
            console.log("First");
        });
    }

    async getProfile() {
        if (this.token) {
            const header = { Authorization: this.token };
            this.http.get(`${baseUrl}/api/user/auth`, { headers: header }).subscribe((res: any) => {
                if (res.success) {
                    this.token = res.token;
                    localStorage.setItem('jwtToken', res.token);
                    this.user = res.user;
                }
                else {
                    this.createToken();
                }
            });
        }
    }

    async updateUser(data: any) {
        if (this.token) {
            let url = `${baseUrl}/api/user/update`;
            const header = { Authorization: this.token };
            this.http.put(url, data, { headers: header }).subscribe((res: any) => {
                if (res.success) {
                    console.log(res.user);
                    this.token = res.token;
                    localStorage.setItem('jwtToken', res.token);
                    this.user = res.user;
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
        if (this.token) {
            let url = `${baseUrl}/api/room/${id}`;
            const header = { Authorization: this.token };
            return this.http.get(url, { headers: header });
        }

    }


    updateRoom(id, data): Observable<any> {
        if (this.token) {
            let url = `${baseUrl}/api/room/${id}`;
            const header = { Authorization: this.token };
            return this.http.put(url, data, { headers: header });
        }
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