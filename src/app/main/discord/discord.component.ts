import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-discord',
    templateUrl: './discord.component.html',
    styleUrls: ['./discord.component.scss']
})
export class DiscordComponent implements OnInit {

    constructor(private titleService: Title) {
        this.titleService.setTitle("vidsnc - Join Discord");
    }

    ngOnInit(): void {
    }

}
