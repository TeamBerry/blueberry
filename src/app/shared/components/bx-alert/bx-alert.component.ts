import { Component, OnInit, Input } from '@angular/core';

interface BoxAlertOptions {
    type: 'success' | 'warning' | 'danger',
    message: string
}

@Component({
    selector: 'app-bx-alert',
    templateUrl: './bx-alert.component.html',
    styleUrls: ['./bx-alert.component.scss']
})
export class BxAlertComponent implements OnInit {
    @Input() options: BoxAlertOptions = {
        type: 'success',
        message: 'This is the default message'
    }

    constructor() { }

    ngOnInit() {
    }

}
