import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Box } from './../../models/box.model';
import { BoxService } from './../../services/box.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/shared/models/user.model';

@Component({
    selector: 'app-box-form',
    templateUrl: './box-form.component.html',
    styleUrls: ['./box-form.component.scss'],
    providers: [BoxService]
})
export class BoxFormComponent implements OnInit {
    @Input() title;
    @Input() box: Box;

    public langs: string[] = [
        'English',
        'Français',
        '日本語',
    ];
    submitted = false;

    context = 'Edit';

    constructor(
        private authService: AuthService,
        public boxService: BoxService,
        public activeModal: NgbActiveModal,
        private router: Router
    ) { }

    ngOnInit() {
        if (!this.box) {
            this.context = 'Create';
            this.box = new Box();
            this.authService.getUser().subscribe(
                (user: User) => {
                    this.box.creator = {
                        _id: user._id,
                        name: user.name
                    }
                }
            )
        }
    }

    onSubmit() {
        this.submitted = true;
        if (this.context === 'Create') {
            this.boxService.store(this.box).subscribe(
                data => {
                    this.activeModal.close();
                    this.router.navigate(['/box/' + data._id]);
                }
            );
        } else {
            this.boxService.update(this.box).subscribe(
                (updatedBox: Box) => {
                    this.activeModal.close();
                }
            )
        }
    }
}
