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
    }

    async register(data) {
        return this.http.post(`${baseUrl}/api/user/`, data);
    }

    async login(data) {
        if (this.token) {
            const header = { Authorization: this.token };
            return this.http.get(`${baseUrl}/api/user/auth`, { headers: header });
        }
        return this.http.post(`${baseUrl}/api/user/login`, data);
    }

    logout() {
        localStorage.removeItem('jwtToken');
        this.user = null;
        this.token = null;
        if (localStorage.getItem('jwtToken') == null) {
            return true;
        }
        return false;
    }

    async getProfile() {
        if (this.token) {
            const header = { Authorization: this.token };
            return this.http.get(`${baseUrl}/api/user/auth`, { headers: header });
        }
        return null;
    }
    // Create
    async createRoom(data, recaptchaToken) {
        if (this.token) {
            const header = { Authorization: this.token };
            return this.http.post(`${baseUrl}/api/room/create`, data, { headers: header }).pipe(catchError(this.errorMgmt));
        }
        else {
            const header = (true) ? { Authorization: recaptchaToken } : undefined;
            return this.http.post(`${baseUrl}/api/room`, data, { headers: header }).pipe(catchError(this.errorMgmt));
        }
    }

    async createPrivateRoom(data) {
        let url = `${baseUrl}/api/room/create`;
        if (this.token) {
            const header = { Authorization: this.token };
            return this.http.post(url, data, { headers: header }).pipe(catchError(this.errorMgmt))
        }
        return null;
    }

    async getPublicRooms() {
        return this.http.get(`${baseUrl}/api/room`);
    }

    async getOwnRooms() {
        if (this.token) {
            const header = { Authorization: this.token };
            return this.http.get(`${baseUrl}/api/room/private`, { headers: header });
        }
        return null;
    }

    // Get user
    getRoom(id): Observable<any> {
        console.log("get room " + id);
        let url = `${baseUrl}/api/room/${id}`;
        return this.http.get(url, { headers: this.headers });
    }

    // Update user
    updateRoom(id, data): Observable<any> {
        let url = `${baseUrl}/api/room/${id}`;
        return this.http.put(url, data, { headers: this.headers });
    }

    async deleteRoom(id) {
        if (this.token) {
            const header = { Authorization: this.token };
            return this.http.delete(`${baseUrl}/api/room/${id}`, { headers: header });
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

    // Get all users
    async adminGetRooms(pw) {
        let url = `${baseUrl}/api/admin/`;
        if (this.token) {
            const header = { Authorization: this.token, pw: pw };
            return this.http.get(url, { headers: header });
        }
        else {
            return null;
        }
    }

    async adminDeleteRoom(pw, id): Promise<Observable<any>> {
        let url = `${baseUrl}/api/admin/rooms/${id}`;
        if (this.token) {
            const header = { Authorization: this.token, pw: pw };
            return this.http.delete(url, { headers: header });
        }
        else {
            return null;
        }

    }
}