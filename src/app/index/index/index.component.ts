import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
    updates: string[] = ["updates", "updates", "updates", "updates", "updates"]
    constructor(private titleService: Title) {
        this.titleService.setTitle("vidsync - Watch Youtube Together");
    }

    ngOnInit(): void {
    }

}
