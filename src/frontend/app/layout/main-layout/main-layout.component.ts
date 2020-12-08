import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

    @Output() public sidenavToggle = new EventEmitter();
    smallScreen = true;
    navPosition = 'end';
    constructor() {
    }

    ngOnInit(): void {
        this.onResize();
    }
    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        if (window.innerWidth < 1440) {
            this.smallScreen = true;
            this.navPosition = 'end';
        }
        else {
            this.smallScreen = false;
            this.navPosition = 'start';

        }
        this.onToggleSidenav();
    }

    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }
}
