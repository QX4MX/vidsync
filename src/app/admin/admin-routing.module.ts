import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../layout/main-layout/main-layout.component';
import { RoomsComponent } from './rooms/rooms.component';



const routes: Routes = [
	{
		path: 'admin',
		component: MainLayoutComponent,
		children: [
			{ path: '', component: RoomsComponent },
			{ path: 'rooms', component: RoomsComponent },
		]
	}

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule { }
