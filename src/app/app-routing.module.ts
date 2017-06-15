import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'app/components/home/home.component';
import { BoxComponent } from 'app/components/box/box.component';
import { BoxFormComponent } from 'app/components/box-form/box-form.component';
import { LikesComponent } from 'app/components/likes/likes.component';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'box/:token', component: BoxComponent },
    { path: 'create', component: BoxFormComponent },
    { path: 'likes', component: LikesComponent }
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
