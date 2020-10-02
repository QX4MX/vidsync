import { Component, OnInit, NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { MatomoTracker } from 'ngx-matomo';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
    updates: string[] = ["updates", "updates", "updates", "updates", "updates"]
    constructor(private titleService: Title, private apiService: ApiService, private ngZone: NgZone, private router: Router,private matomoTracker: MatomoTracker) {
        this.titleService.setTitle("vidsync - Watch Youtube Together");
    }

    ngOnInit(): void {
        this.matomoTracker.setDocumentTitle('vidsync room');
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

}
