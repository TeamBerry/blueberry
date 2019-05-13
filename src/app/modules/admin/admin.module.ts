import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../../shared/shared.module';

import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

@NgModule({
    declarations: [AdminPanelComponent],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class AdminModule { }
