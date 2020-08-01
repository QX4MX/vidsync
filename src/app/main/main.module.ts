import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { IndexComponent } from './index/index.component';
import { RoomComponent } from './room/room.component';
import { DiscordComponent } from './discord/discord.component';
import { PrivacyComponent } from './privacy/privacy.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { YouTubePlayerModule } from "@angular/youtube-player";
//Mat
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatTabsModule } from '@angular/material/tabs'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
    declarations: [IndexComponent, RoomComponent, DiscordComponent, PrivacyComponent],
    imports: [
        CommonModule,
        MainRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        YouTubePlayerModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatListModule,
        MatTabsModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        ClipboardModule,
    ]
})
export class MainModule { }
