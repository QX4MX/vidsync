import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-join',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

    constructor(private router: Router, private ngZone: NgZone) { }

    ngOnInit(): void {
    }

    join(link) {
        window.location = link;
    }
}
