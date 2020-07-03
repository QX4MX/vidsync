import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Component, OnInit, NgZone, Renderer2, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Title } from '@angular/platform-browser';
import { SocketService } from 'src/app/services/socket.service';
import { json } from 'express';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-room-create',
    templateUrl: './room-create.component.html',
    styleUrls: ['./room-create.component.scss']
})

export class RoomCreateComponent implements OnInit {

    selected = 'option1';
    submitted = false;
    formError = '';
    createRoom: FormGroup;
    authenticated: boolean;
    captchaResponse: any;

    constructor(
        public fb: FormBuilder,
        private router: Router,
        private ngZone: NgZone,
        private apiService: ApiService,
        private titleService: Title,
        private socketService: SocketService,
    ) {
        this.mainForm();
        this.titleService.setTitle("vidsync - Create Room");
    }

    async ngOnInit() {
        await this.setAuthenticated();
    }

    mainForm() {
        this.createRoom = this.fb.group({
            name: ['', [Validators.required]],
            privacy: ['Public', [Validators.required]],
        })
    }

    // Getter to access form control
    get myForm() {
        return this.createRoom.controls;
    }

    async resolved(captchaResponse: string) {
        this.captchaResponse = captchaResponse;
        console.log("Resolved captcha with response");
    }

    async setAuthenticated() {
        if ((this.apiService.user)) {
            this.authenticated = true;
        }
        else {
            this.authenticated = false;
        }

    }

    async onSubmit() {
        this.submitted = true;
        let roomVal = this.createRoom.value
        if (!this.createRoom.valid || !this.captchaResponse) {
            console.log("Not Valid");
            return false;
        }
        else {
            if (this.createRoom.value.privacy == 'Private') {
                await (await this.apiService.createPrivateRoom(this.createRoom.value)).subscribe(
                    (res: any) => {
                        if (res.success) {
                            console.log('Room successfully created!')
                            this.ngZone.run(() => this.router.navigateByUrl('/rooms/' + res.data._id));
                        }
                    }
                );
            }
            else {
                await (await this.apiService.createRoom({ name: this.createRoom.value.name, privacy: this.createRoom.value.privacy }, this.captchaResponse)).subscribe(
                    (res: any) => {
                        if (res.success) {
                            console.log('Room successfully created!')
                            this.ngZone.run(() => this.router.navigateByUrl('/rooms/' + res.data._id));
                        }

                    }
                );
            }

        }
    }

    routeToLogin() {
        this.router.navigate(['/login'], { queryParams: { returnUrl: 'rooms/create' } });
    }
}