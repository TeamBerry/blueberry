import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { BoxFormComponent } from './shared/components/box-form/box-form.component';
import { LikesComponent } from './shared/components/likes/likes.component';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
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
