import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { baseUrl } from './baseUrl';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public gapiSetup: boolean = false; // marks if the gapi library has been loaded
    public authInstance: gapi.auth2.GoogleAuth;
    public error: string;
    public user: gapi.auth2.GoogleUser;


    sessionToken: any;
    constructor(private http: HttpClient) {
        this.init();
    }

    async init() {
        if (await this.checkIfUserAuthenticated()) {
            this.user = this.authInstance.currentUser.get();
        }
    }
    // LOGIN && LOGOUT IN SIDENAV.ts
    async initGoogleAuth(): Promise<void> {
        //  Create a new Promise where the resolve 
        // function is the callback passed to gapi.load
        const pload = new Promise((resolve) => {
            gapi.load('auth2', resolve);
        });

        // When the first promise resolves, it means we have gapi
        // loaded and that we can call gapi.init
        return pload.then(async () => {
            await gapi.auth2
                .init({ client_id: '154617797577-0v23uhsk3ki7e5t3lh4k1gridi1n3asg.apps.googleusercontent.com' })
                .then(auth => {
                    this.gapiSetup = true;
                    this.authInstance = auth;
                });
        });
    }

    async checkIfUserAuthenticated(): Promise<boolean> {
        // Initialize gapi if not done yet
        if (!this.gapiSetup) {
            await this.initGoogleAuth();
        }
        return this.authInstance.isSignedIn.get();
    }
}

