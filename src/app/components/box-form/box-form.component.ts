import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Box } from './../../box';
import { BoxService } from './../../services/box.service';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-box-form',
    templateUrl: './box-form.component.html',
    styleUrls: ['./box-form.component.scss'],
    providers: [BoxService]
})
export class BoxFormComponent implements OnInit {
    @Input() title;
    boxForm: FormGroup;
    public langs: string[] = [
        'English',
        'Français',
        '日本語',
    ];
    submitted = false;

    model = new Box('', '', '', this.langs[0]);

    constructor(
        public boxService: BoxService,
        public activeModal: NgbActiveModal,
        private router: Router) { }

    ngOnInit() {
    }

    onSubmit() {
        this.submitted = true;
        if (this.model.token === '') {
            this.boxService.post(this.model).subscribe(
                data => {
                    this.activeModal.close();
                    this.router.navigate(['/box/' + data.token]);
                }
            );
        } else {
            this.boxService.put(this.model).subscribe(
                data => console.log(data)
            );
        }
    }
}
