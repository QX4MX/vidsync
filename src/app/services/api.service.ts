import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { baseUrl } from './baseUrl';
import { User } from '../model/user';
import { AuthService } from './auth.service';
@Injectable({
    providedIn: 'root'
})

export class ApiService {
    headers = new HttpHeaders();

    constructor(private http: HttpClient, private auth: AuthService) {
        console.log("Expecting Api at " + baseUrl + "/api");
        this.headers.set('Content-Type', 'application/json');
    }

    async getProfile() {
        if (await this.auth.checkIfUserAuthenticated()) {
            const header = (this.auth.checkIfUserAuthenticated()) ? { Authorization: this.auth.getToken() } : undefined;
            return this.http.get(`${baseUrl}/api/user/profile`, { headers: header });
        }
        return null;
    }
    // Create
    async createRoom(data) {
        if (await this.auth.checkIfUserAuthenticated()) {
            const header = (this.auth.checkIfUserAuthenticated()) ? { Authorization: this.auth.getToken() } : undefined;
            return this.http.post(`${baseUrl}/api/room/create`, data, { headers: header }).pipe(catchError(this.errorMgmt));
        }
        else {
            return this.http.post(`${baseUrl}/api/room`, data).pipe(catchError(this.errorMgmt));
        }
    }

    async createPrivateRoom(data) {
        let url = `${baseUrl}/api/room/create`;
        if (await this.auth.checkIfUserAuthenticated()) {
            const header = (this.auth.checkIfUserAuthenticated()) ? { Authorization: this.auth.getToken() } : undefined;
            return this.http.post(url, data, { headers: header }).pipe(catchError(this.errorMgmt))
        }
        return null;
    }

    async getPublicRooms() {
        return this.http.get(`${baseUrl}/api/room`);
    }

    async getOwnRooms() {
        if (await this.auth.checkIfUserAuthenticated()) {
            const header = (this.auth.checkIfUserAuthenticated()) ? { Authorization: this.auth.getToken() } : undefined;
            return this.http.get(`${baseUrl}/api/room/private`, { headers: header });
        }
        return null;
    }

    // Get user
    getRoom(id): Observable<any> {
        console.log("get room " + id);
        let url = `${baseUrl}/api/room/${id}`;
        return this.http.get(url, { headers: this.headers }).pipe(
            map((res: Response) => {
                return res || {}
            }),
            catchError(this.errorMgmt)
        )
    }

    // Update user
    updateRoom(id, data): Observable<any> {
        let url = `${baseUrl}/api/room/${id}`;
        return this.http.put(url, data, { headers: this.headers }).pipe(
            map((res: Response) => {
                console.log("response:")
                console.log(res);
                return res || {}
            }),
            catchError(this.errorMgmt)
        )
    }

    async deleteRoom(id) {
        if (await this.auth.checkIfUserAuthenticated()) {
            const header = (this.auth.checkIfUserAuthenticated()) ? { Authorization: this.auth.getToken() } : undefined;
            return this.http.delete(`${baseUrl}/api/room/${id}`, { headers: header }).pipe(
                catchError(this.errorMgmt)
            );
        }
        return null;
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
    adminGetRooms(pw: string) {
        return this.http.get(`${baseUrl}/api/admin/room`, {
            params: {
                pw: pw
            }
        });
    }

    adminDeleteRoom(id, pw): Observable<any> {
        let url = `${baseUrl}/api/room/${id}`;
        return this.http.delete(url, { headers: this.headers, params: { pw: pw } }).pipe(
            catchError(this.errorMgmt)
        )
    }
}