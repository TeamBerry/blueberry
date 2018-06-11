import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthDirective } from '../shared/directive/auth.directive';

@NgModule({
    imports: [CommonModule],
    exports: [CommonModule, FormsModule, AuthDirective],
    declarations: [AuthDirective],
    providers: [AuthDirective]
})
export class SharedModule { }