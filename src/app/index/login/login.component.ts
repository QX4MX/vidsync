import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { async } from '@angular/core/testing';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    user;
    form: FormGroup;
    public loginInvalid: boolean;
    private formSubmitAttempt: boolean;
    private returnUrl: string;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/rooms/public';


        this.form = this.fb.group({
            username: ['', Validators.email],
            password: ['', Validators.required]
        });


    }

    async ngOnInit(): Promise<void> {
        if (await this.authService.checkIfUserAuthenticated()) {
            console.log("Is Already Logged In");
            this.router.navigate([this.returnUrl]);
        }

    }

    async onSubmit() {
        // TODO
        this.loginInvalid = false;
        this.formSubmitAttempt = false;
        if (this.form.valid) {
            try {
                const username = this.form.get('username').value;
                const password = this.form.get('password').value;
                await this.authService.login(username, password);
            } catch (err) {
                this.loginInvalid = true;
            }
        } else {
            this.formSubmitAttempt = true;
        }
    }

    async googleLogin() {
        //TODO redirect / sidenav update
        await this.authService.googleLogin().then(
            (success) => {
                if (success) {
                    console.log("LoggedIn");
                    this.router.navigate([this.returnUrl]);
                }
                else {
                    console.log("Login Failed");
                }
            }
        );
    }
}
