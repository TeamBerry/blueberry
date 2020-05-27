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

    public langs: Array<{ key: string, value: string }> = [
        {
            key: 'cs',
            value: 'Čeština'
        },
        {
            key: 'da',
            value: 'Dansk'
        },
        {
            key: 'de',
            value: 'Deutsch'
        },
        {
            key: 'en',
            value: 'English'
        },
        {
            key: 'es',
            value: 'Español'
        },
        {
            key: 'fr',
            value: 'Français'
        },
        {
            key: 'hr',
            value: 'Hrvatski jezik'
        },
        {
            key: 'it',
            value: 'Italiano'
        },
        {
            key: 'pl',
            value: 'Język polski'
        },
        {
            key: 'lv',
            value: 'Latviešu valoda'
        },
        {
            key: 'lt',
            value: 'Lietuvių kalba'
        },
        {
            key: 'hu',
            value: 'Magyar'
        },
        {
            key: 'nl',
            value: 'Nederlands'
        },
        {
            key: 'no',
            value: 'Norsk'
        },
        {
            key: 'pt',
            value: 'Português'
        },
        {
            key: 'ro',
            value: 'Română'
        },
        {
            key: 'sk',
            value: 'Slovenčina'
        },
        {
            key: 'fi',
            value: 'Suomi'
        },
        {
            key: 'sv',
            value: 'Svenska'
        },
        {
            key: 'vi',
            value: 'Tiếng Việt'
        },
        {
            key: 'tr',
            value: 'Türkçe'
        },
        {
            key: 'el',
            value: 'Ελληνικά'
        },
        {
            key: 'bg',
            value: 'Български език'
        },
        {
            key: 'ru',
            value: 'Pусский'
        },
        {
            key: 'th',
            value: 'ภาษาไทย'
        },
        {
            key: 'zh-cn',
            value: '中文 简体'
        },
        {
            key: 'zh-tw',
            value: '中文 繁體'
        },
        {
            key: 'ja',
            value: '日本語'
        },
        {
            key: 'ko',
            value: '한국어'
        }
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
