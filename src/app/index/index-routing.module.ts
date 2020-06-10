import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../layout/main-layout/main-layout.component';
import { IndexComponent } from './index/index.component';
import { DiscordComponent } from './discord/discord.component';


const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: IndexComponent },
            { path: 'discord', component: DiscordComponent },
            { path: 'privacy', component: DiscordComponent },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndexRoutingModule { }
