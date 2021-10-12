import { Component, OnInit, NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
    constructor(
        private titleService: Title,
        private apiService: ApiService,
        public languageService: LanguageService,
        private ngZone: NgZone,
        private router: Router
    ) {
        this.titleService.setTitle("Vidsync - Watch Youtube Together");
    }

    ngOnInit(): void {
    }

    async createRoom() {
        (await this.apiService.createRoom()).subscribe(
            (res: any) => {
                if (res.success) {
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
