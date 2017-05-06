import { BoxService } from 'app/services/box.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [BoxService]
})
export class HomeComponent implements OnInit {
    title = 'YouTube. With everyone.';
    boxes;
    loading = true;

    constructor(public router: Router,
        public boxService: BoxService) { }

    ngOnInit() {
        this.boxService.list().subscribe(
            response => {
                this.boxes = response;
                this.loading = false;
            },
            error => console.log(error)
        );
    }

    enter(token: string) {
        this.router.navigate(['box/', token]);
    }
}
