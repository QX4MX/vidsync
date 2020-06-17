import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
    user;
    constructor(private authService: AuthService, private ngZone: NgZone, private router: Router) {
    }

    async ngOnInit(): Promise<void> {
        if (await this.authService.checkIfUserAuthenticated()) {
            this.user = this.authService.user;
        }
    }

    async login(): Promise<gapi.auth2.GoogleUser> {
        // Initialize gapi if not done yet
        if (!this.authService.gapiSetup) {
            await this.authService.initGoogleAuth();
        }

        // Resolve or reject signin Promise
        return new Promise(async () => {
            await this.authService.authInstance.signIn().then(

                user => {
                    this.user = user
                    this.authService.user = user
                },
                error => this.authService.error = error);
        });
    }

    logout() {
        // Resolve or reject signin Promise
        return new Promise(async () => {
            await this.authService.authInstance.disconnect().then(
                user => {
                    this.authService.user = user
                    this.user = this.authService.user
                },
                error => this.authService.error = error);
        });
    }
}
