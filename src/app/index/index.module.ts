import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index/index.component';
import { DiscordComponent } from './discord/discord.component';

//Material
import { MatButtonModule } from '@angular/material/button';
import { PrivacyComponent } from './privacy/privacy.component'



@NgModule({
    declarations: [IndexComponent, DiscordComponent, PrivacyComponent],
    imports: [
        CommonModule,
        IndexRoutingModule,
        MatButtonModule,
    ]
})
export class IndexModule { }
