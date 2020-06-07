import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index/index.component';

//Material
import { MatButtonModule } from '@angular/material/button'


@NgModule({
	declarations: [IndexComponent],
	imports: [
		CommonModule,
		IndexRoutingModule,
		MatButtonModule,
	]
})
export class IndexModule { }
