import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    smallScreen: boolean;


    constructor() { }

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


}
