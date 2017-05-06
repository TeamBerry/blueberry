import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'app/components/home/home.component';
import { BoxComponent } from 'app/components/box/box.component';

const appRoutes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'box/:token', component: BoxComponent}
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
