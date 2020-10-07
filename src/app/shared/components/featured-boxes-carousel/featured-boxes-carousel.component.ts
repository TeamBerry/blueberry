import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Box } from 'app/shared/models/box.model';

@Component({
  selector: 'app-featured-boxes-carousel',
  templateUrl: './featured-boxes-carousel.component.html',
  styleUrls: ['./featured-boxes-carousel.component.scss']
})
export class FeaturedBoxesCarouselComponent implements OnInit {
    @Input() boxes: Box[];
    selectedIndex: number = 0;
    selectedBox: Box;

    constructor(
      public router: Router
    ) { }

    ngOnInit() {
        this.selectBox()
    }

    selectBox() {
        this.selectedBox = this.boxes[this.selectedIndex];
    }

    previous() {
        this.selectedIndex -= 1;
        if (this.selectedIndex - 1 < 0) {
            this.selectedIndex = this.boxes.length;
        }

        this.selectBox()
    }

    next() {
        this.selectedIndex += 1;
        if (this.selectedIndex + 1 > this.boxes.length) {
            this.selectedIndex = 0;
        }

        this.selectBox()
    }


    /**
     * When the user clicks on the widget box, he enters the box
     *
     * @param {string} token The Mongo _id of the box
     * @memberof HomeComponent
     */
    enter(token: string) {
        this.router.navigate(['box/', token]);
    }
}
