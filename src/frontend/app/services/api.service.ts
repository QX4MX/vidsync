import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from './cookie.service';
@Injectable({
    providedIn: 'root',
})
export class ApiService {
    baseUrl = window.origin;
    headers = new HttpHeaders();
    user;
    token;
    constructor(private http: HttpClient, private cookieService: CookieService) {
        if (window.origin.includes('localhost')) {
            this.baseUrl = 'http://localhost:4000';
        } else {
            this.baseUrl = window.origin;
        }
        this.headers.set('Content-Type', 'application/json');
        this.token = cookieService.getCookie('auth_token');
        if (this.token) {
            this.getProfile();
        } else {
            this.createToken();
        }
    }

    createToken() {
        this.http.get(`${this.baseUrl}/api/user/new`).subscribe((res: any) => {
            if (res.success) {
                this.token = res.token;
                this.user = res.user;
                this.cookieService.setCookie('auth_token', this.token, 30);
            }
        });
    }

    getProfile() {
        if (this.token) {
            const header = { Authorization: this.token };
            this.http.get(`${this.baseUrl}/api/user/auth`, { headers: header }).subscribe((res: any) => {
                if (res.success) {
                    this.token = res.token;
                    this.cookieService.setCookie('auth_token', this.token, 30);
                    this.user = res.user;
                } else {
                    this.createToken();
                }
            });
        }
    }

    updateUser(data: any) {
        if (this.token) {
            let url = `${this.baseUrl}/api/user/update`;
            const header = { Authorization: this.token };
            this.http.put(url, data, { headers: header }).subscribe((res: any) => {
                if (res.success) {
                    this.token = res.token;
                    this.cookieService.setCookie('auth_token', this.token, 30);
                    this.user = res.user;
                }
            });
        }
    }

    // Create
    createRoom() {
        if (this.token) {
            const header = { Authorization: this.token };
            return this.http.get(`${this.baseUrl}/api/room/create`, { headers: header });
        }
    }

    getRoom(id): Observable<any> {
        if (this.token) {
            let url = `${this.baseUrl}/api/room/${id}`;
            const header = { Authorization: this.token };
            return this.http.get(url, { headers: header });
        }
    }

    updateRoom(id, data): Observable<any> {
        if (this.token) {
            let url = `${this.baseUrl}/api/room/${id}`;
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
