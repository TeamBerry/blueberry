import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoxComponent } from './pages/box/box.component';

const jukeboxRoutes: Routes = [
    { path: 'box/:id', component: BoxComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(jukeboxRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class JukeboxRoutingModule { }