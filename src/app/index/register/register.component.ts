import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    form: FormGroup;
    returnUrl: any;
    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/rooms/public';

        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnInit(): void {

    }

    async onSubmit() {
        if (this.form.valid) {
            (await this.apiService.register(this.form.value)).subscribe((data: any) => {
                if (data.success) {
                    this.apiService.user = data.user;
                    this.apiService.token = data.token;
                    localStorage.setItem('jwtToken', data.token.toString());
                    this.router.navigate([this.returnUrl]);
                }
                else {
                    console.log("Register Failed");
                }
            });
        }
    }
}
