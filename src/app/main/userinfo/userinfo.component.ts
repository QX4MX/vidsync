import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-userinfo',
    templateUrl: './userinfo.component.html',
    styleUrls: ['./userinfo.component.scss']
})
export class UserinfoComponent implements OnInit {
    username;
    constructor(private apiService: ApiService, private _bottomSheetRef: MatBottomSheetRef<UserinfoComponent>) { }
    ngOnInit(): void {
        this.username = this.apiService.user.username;
    }

    updateUsername(newUsername: string) {
        this.apiService.updateUser({ username: newUsername });
        this._bottomSheetRef.dismiss();
    }

    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }

}
