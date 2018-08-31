import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthDirective } from '../shared/directive/auth.directive';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';
import { VideoEntryComponent } from './components/video-entry/video-entry.component';

@NgModule({
    imports: [CommonModule],
    declarations: [
        AuthDirective,
        SlideToggleComponent,
        VideoEntryComponent,
    ],
    exports: [
        CommonModule,
        FormsModule,
        AuthDirective,
        SlideToggleComponent,
        VideoEntryComponent
    ],
    providers: [AuthDirective],
})
export class SharedModule { }