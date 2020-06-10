import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index/index.component';
import { DiscordComponent } from './discord/discord.component';

//Material
import { MatButtonModule } from '@angular/material/button'



@NgModule({
    declarations: [IndexComponent, DiscordComponent],
    imports: [
        CommonModule,
        IndexRoutingModule,
        MatButtonModule,
    ]
})
export class IndexModule { }
