import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AuthDirective } from '../shared/directive/auth.directive';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';
import { VideoEntryComponent } from './components/video-entry/video-entry.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BoxDeletionEstimationPipe } from './pipes/box-deletion-estimation.pipe';
import { PlaylistViewComponent } from './components/playlist-view/playlist-view.component';
import { PlaylistWidgetComponent } from './components/playlist-widget/playlist-widget.component';
import { PlaylistSelectorComponent } from './components/playlist-selector/playlist-selector.component';

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
    ],
    declarations: [
        AuthDirective,
        SlideToggleComponent,
        VideoEntryComponent,
        BoxDeletionEstimationPipe,
        PlaylistViewComponent,
        PlaylistWidgetComponent,
        PlaylistSelectorComponent,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthDirective,
        SlideToggleComponent,
        VideoEntryComponent,
        NgbModule,
        BoxDeletionEstimationPipe,
        PlaylistWidgetComponent
    ],
    providers: [AuthDirective],
    entryComponents: [
        PlaylistViewComponent,
        PlaylistSelectorComponent
    ]
})
export class SharedModule { }
