import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-profile-picture',
    templateUrl: './profile-picture.component.html',
    styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit {
    @Input() userId: string;
    @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

    /**
     * Profile picture of the box creator
     *
     * @memberof BoxComponent
     */
    public pictureLocation = `${environment.amazonBuckets}/${environment.profilePictureBuckets}/default-picture`;

    constructor() { }

    ngOnInit() {
        if (this.userId) {
            this.pictureLocation = `${environment.amazonBuckets}/${environment.profilePictureBuckets}/${this.userId}-picture`
        } else {
            this.loadDefaultPicture();
        }
    }

    loadDefaultPicture() {
        this.pictureLocation = `${environment.amazonBuckets}/${environment.profilePictureBuckets}/default-picture`;
    }

}
