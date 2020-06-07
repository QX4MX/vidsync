import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { DiscordComponent } from './discord/discord.component';


@NgModule({
	declarations: [DiscordComponent],
	imports: [
		CommonModule,
		UsersRoutingModule
	]
})
export class UsersModule { }
