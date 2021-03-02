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
    selectedIndex = 0;
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
        this.selectedIndex = (this.selectedIndex - 1 < 0) ? this.boxes.length - 1 : this.selectedIndex - 1

        this.selectBox()
    }

    next() {
        this.selectedIndex = (this.selectedIndex + 1 >= this.boxes.length) ? 0 : this.selectedIndex + 1

        this.selectBox()
    }


    /**
     * When the user clicks on the widget box, he enters the box
     *
     * @param token The Mongo _id of the box
     * @memberof HomeComponent
     */
    enter(token: string) {
        this.router.navigate(['box/', token]);
    }
}
