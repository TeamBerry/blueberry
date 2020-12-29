import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { UserService } from 'app/shared/services/user.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-picture-deleter',
  templateUrl: './picture-deleter.component.html',
  styleUrls: ['./picture-deleter.component.scss']
})
export class PictureDeleterComponent implements OnInit, OnChanges {
    @Input() userPictureName: string;

    /**
     * Default profile picture
     *
     * @memberof BoxComponent
     */
    public defaultPicture = `${environment.userContentBucket}/${environment.profilePictureBuckets}/default-picture`;
    public userPicture = this.defaultPicture;
    authSubject: AuthSubject = AuthService.getAuthSubject();
    success = false;

    constructor(
        public authService: AuthService,
        public activeModal: NgbActiveModal,
        public userService: UserService
    ) { }

    ngOnInit() {
      this.userPicture = `${environment.userContentBucket}/${environment.profilePictureBuckets}/${this.userPictureName}`
    }

    ngOnChanges() {
      this.userPicture = `${environment.userContentBucket}/${environment.profilePictureBuckets}/${this.userPictureName}`
    }

    deletePicture() {
        this.userService.deletePicture().subscribe(
            (response) => {
                this.authSubject.settings.picture = response.file
                this.authService.refreshSubject(this.authSubject)
                this.success = true;
                setTimeout(() => {
                    this.activeModal.dismiss()
                }, 3000)
            }
        )
    }

}
