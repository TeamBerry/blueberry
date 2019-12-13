import { Component, OnInit, Input } from '@angular/core';

interface BoxAlertOptions {
    type: 'success' | 'warning' | 'danger',
    icon: boolean,
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
        icon: true,
        message: 'This is the default message'
    }

    constructor() { }

    ngOnInit() {
    }

}
