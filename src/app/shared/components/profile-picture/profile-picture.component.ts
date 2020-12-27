import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-profile-picture',
    templateUrl: './profile-picture.component.html',
    styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit, OnChanges {
    @Input() fileName: string;
    @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

    /**
     * Default picture location
     *
     * @memberof BoxComponent
     */
    public pictureLocation = `${environment.userContentBucket}/${environment.profilePictureBuckets}/default-picture`;

    constructor() { }

    ngOnInit() {
        this.loadUserPicture();
    }

    ngOnChanges() {
        this.loadUserPicture();
    }

    loadUserPicture() {
        this.pictureLocation = this.fileName
            ? `${environment.userContentBucket}/${environment.profilePictureBuckets}/${this.fileName}`
            : this.pictureLocation
    }

}
