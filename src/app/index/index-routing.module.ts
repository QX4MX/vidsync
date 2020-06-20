import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../layout/main-layout/main-layout.component';
import { IndexComponent } from './index/index.component';
import { DiscordComponent } from './discord/discord.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: IndexComponent },
            { path: 'discord', component: DiscordComponent },
            { path: 'privacy', component: PrivacyComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndexRoutingModule { }
