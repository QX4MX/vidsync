import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { UserinfoComponent } from '../../main/userinfo/userinfo.component';
import { LanguageService } from '../../services/language.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    smallScreen: boolean;


    constructor(private userinfo: MatBottomSheet, private languageService: LanguageService) { }

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

    openUserInfo(): void {
        this.userinfo.open(UserinfoComponent);
    }


}
