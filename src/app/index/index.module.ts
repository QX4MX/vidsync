import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index/index.component';
import { DiscordComponent } from './discord/discord.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { PrivacyComponent } from './privacy/privacy.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'
//Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';



@NgModule({
    declarations: [IndexComponent, DiscordComponent, PrivacyComponent, LoginComponent, RegisterComponent],
    imports: [
        CommonModule,
        IndexRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule
    ]
})
export class IndexModule { }
