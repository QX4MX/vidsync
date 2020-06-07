import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from './layout/layout.module';
import { RoomsModule } from './rooms/rooms.module';
import { HttpClientModule } from '@angular/common/http';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { IndexModule } from './index/index.module';


const routes: Routes = [
	{
		path: '',
		redirectTo: '/',
		pathMatch: 'full'
	}
];

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		RouterModule.forRoot(routes),
		LayoutModule,
		IndexModule,
		UsersModule,
		RoomsModule,
		AdminModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
