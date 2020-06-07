import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';

import { SidenavComponent } from './sidenav/sidenav.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([]),
		MatToolbarModule,
		MatSidenavModule,
		MatListModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
	],
	exports: [
		MainLayoutComponent,
	],
	declarations: [
		MainLayoutComponent,
		HeaderComponent,
		SidenavComponent,

	]
})
export class LayoutModule { }