import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthDirective } from '../shared/directive/auth.directive';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';

@NgModule({
    imports: [CommonModule],
    declarations: [AuthDirective, SlideToggleComponent],
    exports: [CommonModule, FormsModule, AuthDirective,
        SlideToggleComponent],
    providers: [AuthDirective]
})
export class SharedModule { }