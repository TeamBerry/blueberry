import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AuthDirective } from '../shared/directive/auth.directive';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';
import { VideoEntryComponent } from './components/video-entry/video-entry.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BoxDeletionEstimationPipe } from './pipes/box-deletion-estimation.pipe';
import { ThemeService } from './services/theme.service';
import { UserService } from './services/user.service';

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
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthDirective,
        SlideToggleComponent,
        VideoEntryComponent,
        NgbModule,
        BoxDeletionEstimationPipe
    ],
    providers: [AuthDirective, ThemeService, UserService],
    entryComponents: [
    ]
})
export class SharedModule { }
