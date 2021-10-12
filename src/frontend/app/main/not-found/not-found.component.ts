import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LanguageService } from '../../services/language.service';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

    constructor(public languageService: LanguageService, private titleService: Title) { }

    ngOnInit(): void {
        this.titleService.setTitle("Vidsync - 404")
    }

}
