import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../layout/main-layout/main-layout.component';
import { AdminComponent } from './admin/admin.component';



const routes: Routes = [
    {
        path: 'admin',
        component: MainLayoutComponent,
        children: [
            { path: '', component: AdminComponent },
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
