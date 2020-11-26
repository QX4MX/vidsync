import { Component, OnInit, NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
/* import { MatomoTracker } from 'ngx-matomo'; */

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
    constructor(private titleService: Title, private apiService: ApiService, private languageService: LanguageService, private ngZone: NgZone, private router: Router,/* private matomoTracker: MatomoTracker */) {
        this.titleService.setTitle("vidsync - Watch Youtube Together");
    }

    ngOnInit(): void {
        /* this.matomoTracker.setDocumentTitle('vidsync-index');
        this.matomoTracker.setCustomUrl('/' + window.location.hash.substr(1));
        this.matomoTracker.trackPageView(); */
    }

    async createRoom() {
        (await this.apiService.createRoom()).subscribe(
            (res: any) => {
                console.log(res);
                if (res.success) {
                    console.log('Room successfully created!')
                    this.ngZone.run(() => this.router.navigateByUrl('/room/' + res.data._id));
                }

            });
    }

    join(link) {
        window.location = link;
    }

    inviteDCBot() {
        window.open("https://discord.com/api/oauth2/authorize?client_id=762308036978802718&permissions=67584&scope=bot", '_blank');
    }

}
