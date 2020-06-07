import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Youtube
import { YouTubePlayerModule } from "@angular/youtube-player";
//Routing
import { RoomsRoutingModule } from './rooms-routing.module';
//Components
import { RoomListComponent } from './room-list/room-list.component';
import { RoomCreateComponent } from './room-create/room-create.component';
import { RoomComponent } from './room/room.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';





@NgModule({
	declarations: [RoomListComponent, RoomCreateComponent, RoomComponent],
	imports: [
		CommonModule,
		RoomsRoutingModule,
		YouTubePlayerModule,
		FormsModule,
		MatInputModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatRadioModule,
		MatCardModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatSnackBarModule,
		MatIconModule,
		MatListModule
	]
})
export class RoomsModule { }
