import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'app/components/home/home.component';
import { BoxFormComponent } from 'app/components/box-form/box-form.component';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'create', component: BoxFormComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
