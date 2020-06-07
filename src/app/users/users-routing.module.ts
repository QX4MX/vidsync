import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../layout/main-layout/main-layout.component';
import { DiscordComponent } from './discord/discord.component';


const routes: Routes = [
	{
		path: 'user',
		component: MainLayoutComponent,
		children: [
			{ path: 'discord', component: DiscordComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UsersRoutingModule { }
