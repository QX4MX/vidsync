import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Title } from '@angular/platform-browser';
import { SocketService } from 'src/app/services/socket.service';
import { json } from 'express';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-room-create',
    templateUrl: './room-create.component.html',
    styleUrls: ['./room-create.component.scss']
})

export class RoomCreateComponent implements OnInit {

    selected = 'option1';
    submitted = false;
    createRoom: FormGroup;
    authenticated: boolean;

    constructor(
        public fb: FormBuilder,
        private router: Router,
        private ngZone: NgZone,
        private apiService: ApiService,
        private authService: AuthService,
        private titleService: Title,
        private socketService: SocketService
    ) {
        this.mainForm();
        this.titleService.setTitle("vidsync - Create Room");
        socketService.socket.emit('leave');
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
    async setAuthenticated() {
        if (await this.authService.checkIfUserAuthenticated()) {
            this.authenticated = true;
        }
        else {
            this.authenticated = false;
        }

    }

    async onSubmit() {
        this.submitted = true;
        if (!this.createRoom.valid) {
            console.log("Not Valid");
            return false;
        }
        else {
            if (this.createRoom.value.privacy == 'Private') {
                await (await this.apiService.createPrivateRoom(this.createRoom.value)).subscribe(
                    (res) => {
                        console.log('Room successfully created!')
                        let json = JSON.stringify(res);
                        var obj = JSON.parse(json);
                        this.ngZone.run(() => this.router.navigateByUrl('/rooms/' + obj.data._id));
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            }
            else {
                await this.apiService.createRoom(this.createRoom.value).subscribe(
                    (res) => {
                        console.log('Room successfully created!')
                        let json = JSON.stringify(res);
                        var obj = JSON.parse(json);
                        this.ngZone.run(() => this.router.navigateByUrl('/rooms/' + obj.data._id));
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            }

        }
    }

    routeToLogin() {
        this.router.navigate(['/login'], { queryParams: { returnUrl: 'rooms/create' } });
    }
}