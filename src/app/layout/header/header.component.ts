import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SettingsComponent } from 'src/app/main/settings/settings.component';
import { UserinfoComponent } from 'src/app/main/userinfo/userinfo.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    smallScreen: boolean;


    constructor(private settings: MatBottomSheet, private userinfo: MatBottomSheet) { }

    ngOnInit(): void {
        this.onResize();
    }
    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        if (window.innerWidth < 1440) {
            this.smallScreen = true;
        }
        else {
            this.smallScreen = false;
        }
    }

    openSettings(): void {
        this.settings.open(SettingsComponent);
    }

    openUserInfo(): void {
        this.userinfo.open(UserinfoComponent);
    }


}
