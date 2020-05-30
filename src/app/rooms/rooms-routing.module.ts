import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainLayoutComponent} from '../layout/main-layout/main-layout.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomCreateComponent } from './room-create/room-create.component';
import { RoomEditComponent } from './room-edit/room-edit.component';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  {
    path: 'room',
    component: MainLayoutComponent,
    children: [
      { path: '', component: RoomListComponent },
      { path: 'create', component: RoomCreateComponent },
      { path: 'edit/:id', component: RoomEditComponent },
      { path: ':id', component: RoomComponent },
      
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomsRoutingModule { }
