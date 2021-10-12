import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { IndexComponent } from './index/index.component';
import { RoomComponent } from './room/room.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { UserinfoComponent } from './userinfo/userinfo.component';

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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { PlayerComponent } from './room/player/player.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
    declarations: [IndexComponent, RoomComponent, PrivacyComponent, UserinfoComponent, PlayerComponent, NotFoundComponent],
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
        MatProgressBarModule,
        MatSnackBarModule,
        MatBottomSheetModule,
        MatMenuModule,
        MatSelectModule,
        ClipboardModule
    ]
})
export class MainModule { }
