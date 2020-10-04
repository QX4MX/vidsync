import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
/* import { MatomoTracker } from 'ngx-matomo'; */

@Component({
    selector: 'app-discord',
    templateUrl: './discord.component.html',
    styleUrls: ['./discord.component.scss']
})
export class DiscordComponent implements OnInit {

    constructor(private titleService: Title, /* private matomoTracker:MatomoTracker */) {
        this.titleService.setTitle("vidsnc - Join Discord");
    }

    ngOnInit(): void {
        /* this.matomoTracker.setDocumentTitle('vidsync-index');
        this.matomoTracker.setCustomUrl('/' + window.location.hash.substr(1));
        this.matomoTracker.trackPageView(); */
    }

}
