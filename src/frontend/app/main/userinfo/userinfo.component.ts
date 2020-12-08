import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ApiService } from '../../services/api.service';
import { Language, LanguageService } from '../../services/language.service';


@Component({
    selector: 'app-userinfo',
    templateUrl: './userinfo.component.html',
    styleUrls: ['./userinfo.component.scss']
})
export class UserinfoComponent implements OnInit {
    username;
    languagesArr;
    constructor(private apiService: ApiService, public languageService: LanguageService, private _bottomSheetRef: MatBottomSheetRef<UserinfoComponent>) { }
    ngOnInit(): void {
        if (this.apiService && this.apiService.user) {
            this.username = this.apiService.user.username;
        }
        this.languagesArr = this.languageService.languagesArr;
    }

    updateUsername(newUsername: string) {
        this.apiService.updateUser({ username: newUsername });
        this._bottomSheetRef.dismiss();
    }

    updateLanguage(event) {
        this.languageService.updateLanguage(this.languageService.getLanguageByName(event));
    }

    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }

}
