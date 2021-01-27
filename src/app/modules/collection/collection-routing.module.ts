import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CollectionComponent } from "./collection.component";

const collectionRoutes: Routes = [
    { path: '', component: CollectionComponent }
]

@NgModule({
    imports: [
        RouterModule.forChild(collectionRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class CollectionRoutingModule { }