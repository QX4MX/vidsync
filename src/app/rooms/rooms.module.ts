import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Youtube
import { YouTubePlayerModule } from "@angular/youtube-player";
//Routing
import { RoomsRoutingModule } from './rooms-routing.module';
//Components
import { RoomListComponent } from './room-list/room-list.component';
import { RoomEditComponent } from './room-edit/room-edit.component';
import { RoomCreateComponent } from './room-create/room-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Material
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select'
import {MatRadioModule} from '@angular/material/radio';
import { RoomComponent } from './room/room.component'


@NgModule({
  declarations: [RoomListComponent, RoomEditComponent, RoomCreateComponent, RoomComponent],
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
  ]
})
export class RoomsModule { }
