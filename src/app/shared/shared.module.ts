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
import { ThemeService } from './services/theme.service';
import { UserService } from './services/user.service';
import { FilterPipe } from './pipes/filter.pipe';
import { PictureUploaderComponent } from './components/picture-uploader/picture-uploader.component';
import { BxAlertComponent } from './components/bx-alert/bx-alert.component';
import { DurationPipe } from './pipes/duration.pipe';
import { LikeButtonComponent } from 'app/modules/jukebox/components/like-button/like-button.component';
import { BxButtonComponent } from './components/bx-button/bx-button.component';

// Feature Modules
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { BxCheckboxComponent } from './components/bx-checkbox/bx-checkbox.component';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
    ],
    declarations: [
        AuthDirective,
        SlideToggleComponent,
        VideoEntryComponent,
        BoxDeletionEstimationPipe,
        PlaylistViewComponent,
        PlaylistWidgetComponent,
        PlaylistSelectorComponent,
        FilterPipe,
        PictureUploaderComponent,
        BxAlertComponent,
        DurationPipe,
        LikeButtonComponent,
        BxButtonComponent,
        BxCheckboxComponent
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
        FilterPipe,
        PictureUploaderComponent,
        BxAlertComponent,
        DurationPipe,
        LikeButtonComponent,
        BxButtonComponent,
        PickerModule,
        BxCheckboxComponent,
        PlaylistWidgetComponent
    ],
    providers: [AuthDirective, ThemeService, UserService],
    entryComponents: [
        PictureUploaderComponent
    ]
})
export class SharedModule { }
