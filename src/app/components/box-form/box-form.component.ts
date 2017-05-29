import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-box-form',
    templateUrl: './box-form.component.html',
    styleUrls: ['./box-form.component.scss']
})
export class BoxFormComponent implements OnInit {
    boxForm: FormGroup;
    langs: string[] = [
        'English',
        'Français',
        '日本語',
    ];

    constructor() { }

    ngOnInit() {
        this.boxForm = new FormGroup({
            title: new FormControl(),
            language: new FormControl()
        });
    }

    onSubmit() {

    }

}
