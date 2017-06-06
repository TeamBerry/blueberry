import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Box } from './../../box';
import { BoxService } from './../../services/box.service';

@Component({
    selector: 'app-box-form',
    templateUrl: './box-form.component.html',
    styleUrls: ['./box-form.component.scss']
})
export class BoxFormComponent implements OnInit {
    boxForm: FormGroup;
    public langs: string[] = [
        'English',
        'Français',
        '日本語',
    ];
    submitted = false;

    model = new Box('JFDDFAZ21SD8', 'Test box', '-', this.langs[0]);

    constructor() { }

    ngOnInit() {
        this.boxForm = new FormGroup({
            title: new FormControl(),
            language: new FormControl()
        });
    }

    onSubmit() {
        this.submitted = true;
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}
