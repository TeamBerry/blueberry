import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AuthDirective } from '../shared/directive/auth.directive';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';
import { VideoEntryComponent } from './components/video-entry/video-entry.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BoxDeletionEstimationPipe } from './pipes/box-deletion-estimation.pipe';
import { PlaylistSelectorComponent } from './components/playlist-selector/playlist-selector.component';
import { ThemeService } from './services/theme.service';
import { UserService } from './services/user.service';
import { FilterPipe } from './pipes/filter.pipe';
import { PictureUploaderComponent } from './components/picture-uploader/picture-uploader.component';
import { BxAlertComponent } from './components/bx-alert/bx-alert.component';
import { DurationPipe } from './pipes/duration.pipe';
import { BxButtonComponent } from './components/bx-button/bx-button.component';

// Feature Modules
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { BxCheckboxComponent } from './components/bx-checkbox/bx-checkbox.component';
import { BxTabsetComponent } from './components/bx-tabset/bx-tabset.component';
import { BxChipComponent } from './components/bx-chip/bx-chip.component';
import { BoxStatusIndicatorComponent } from './components/box-status-indicator/box-status-indicator.component';
import { BxRequiredInputIndicatorComponent } from './components/bx-required-input-indicator/bx-required-input-indicator.component';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { FromNowPipe } from './pipes/from-now.pipe';

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
        PlaylistSelectorComponent,
        FilterPipe,
        PictureUploaderComponent,
        BxAlertComponent,
        DurationPipe,
        BxButtonComponent,
        BxCheckboxComponent,
        BxTabsetComponent,
        BxChipComponent,
        BoxStatusIndicatorComponent,
        BxRequiredInputIndicatorComponent,
        ProfilePictureComponent,
        FromNowPipe
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
        BxButtonComponent,
        PickerModule,
        BxCheckboxComponent,
        BxTabsetComponent,
        BxChipComponent,
        BoxStatusIndicatorComponent,
        BxRequiredInputIndicatorComponent,
        ProfilePictureComponent,
        FromNowPipe
    ],
    providers: [AuthDirective, ThemeService, UserService],
    entryComponents: [
        PictureUploaderComponent,
        PlaylistSelectorComponent
    ]
})
export class SharedModule { }
