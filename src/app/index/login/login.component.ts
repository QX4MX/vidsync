import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

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
        private apiService: ApiService,
    ) {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/rooms/public';


        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });


    }

    async ngOnInit(): Promise<void> {
        if (this.apiService.token && this.apiService.user) {
            console.log("Is Already Logged In");
            this.router.navigate([this.returnUrl]);
        }
        else if (this.apiService.token && !this.apiService.user) {
            (await this.apiService.login(null)).subscribe((data: any) => {
                if (data.success) {
                    this.apiService.user = data.user;
                    console.log(data);
                    this.router.navigate([this.returnUrl]);
                }
            })
        }

    }

    async onSubmit() {
        if (this.form.valid) {
            (await this.apiService.login(this.form.value)).subscribe((data: any) => {
                if (data.success) {
                    this.apiService.user = data.user;
                    this.apiService.token = data.token;
                    localStorage.setItem('jwtToken', data.token.toString());
                    console.log("Login Success");
                    this.router.navigate([this.returnUrl]);
                }
                else {
                    console.log("Login Failed");
                }
            });
        }
    }
}
