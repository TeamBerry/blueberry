import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/shared/services/user.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-picture-uploader',
    templateUrl: './picture-uploader.component.html',
    styleUrls: ['./picture-uploader.component.scss'],
})
export class PictureUploaderComponent implements OnInit {
    state: 'selecting' | 'adjusting' = 'selecting'
    picture: File
    picturePreview

    authorizedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    maximumSize = 2

    reader: FileReader = new FileReader();

    errorMessage: string = null
    success = false

    authSubject: AuthSubject = AuthService.getAuthSubject()

    constructor(
        public authService: AuthService,
        public activeModal: NgbActiveModal,
        public userService: UserService
    ) { }

    ngOnInit() {
        this.reader.addEventListener('load', (event: any) => {
            this.picturePreview = this.reader.result
        })
    }

    processFile(pictureInput: any) {
        this.errorMessage = null
        const picture: File = pictureInput.files[0]

        console.log(picture)

        if (this.checkFileSize(picture.size) === false) {
            this.errorMessage = `The file you submitted is too large. The maximum authorized size
            is ${this.maximumSize} MB`
            return
        }

        if (this.checkFileType(picture.type) === false) {
            this.errorMessage = `The file you submitted is of an unauthorized type. The accepted types are 'PNG',
            'JPEG' and 'JPG'`
            return
        }

        this.reader.readAsDataURL(picture);
        this.picture = picture
        this.state = 'adjusting'
    }

    checkFileSize(size): boolean {
        const maximumSize = this.maximumSize * 1000 * 1000
        return size < maximumSize
    }

    checkFileType(type): boolean {
        return this.authorizedTypes.indexOf(type) !== -1
    }

    uploadPicture() {
        const formData: FormData = new FormData();
        formData.append('picture', this.picture, this.picture.name)

        this.userService.uploadPicture(formData, this.authSubject).subscribe(
            (response: { file: string }) => {
                this.authSubject.settings.picture = response.file
                this.authService.refreshSubject(this.authSubject)
                this.success = true
                setTimeout(() => {
                    this.activeModal.dismiss()
                }, 3000)
            }
        )
    }
}
