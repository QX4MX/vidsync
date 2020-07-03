import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
    username;
    constructor(private apiService: ApiService, private ngZone: NgZone, private router: Router) {
    }

    async ngOnInit(): Promise<void> {
        /* if (await this.authService.checkIfUserAuthenticated()) {
            this.username = this.authService.user.getBasicProfile().getName();
        } */
        if (this.apiService.user) {
            console.log(this.apiService.user);
            console.log(this.apiService.user.username);
            this.username = this.apiService.user.username;
        }
        else if (this.apiService.token) {
            (await this.apiService.login(null)).subscribe((data: any) => {
                if (data.success) {
                    this.apiService.user = data.user;
                    this.apiService.token = data.token;
                    localStorage.setItem('jwtToken', data.token);
                    this.username = this.apiService.user.username;
                    console.log("Login Success");
                }
                else {
                    console.log("Login Failed");
                    this.apiService.token = null;
                }
            });
        }
    }

    async logout() {
        if (this.apiService.logout()) {
            this.username = null;
        }
        else {
            console.log("Something went wrong");
        }
    }
}
