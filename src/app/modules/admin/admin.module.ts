import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { BoxesTabComponent } from './components/boxes-tab/boxes-tab.component';
import { BoxAdminWidgetComponent } from './components/box-admin-widget/box-admin-widget.component';

@NgModule({
    declarations: [
        AdminPanelComponent,
        BoxesTabComponent,
        BoxAdminWidgetComponent
    ],
    imports: [
        AdminRoutingModule,
        SharedModule
    ]
})
export class AdminModule { }
