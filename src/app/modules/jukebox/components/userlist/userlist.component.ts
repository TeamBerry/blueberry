import { Component, OnInit } from '@angular/core';

import { User } from 'app/shared/models/user.model';
import { BoxService } from 'app/shared/services/box.service';
import { Observable } from 'rxjs';
import { Box } from 'app/shared/models/box.model';
import { JukeboxService } from '../../jukebox.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-userlist',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.scss'],
    providers: [BoxService]
})
export class UserlistComponent implements OnInit {
    box: Box;

    pictureLocation = `${environment.amazonBuckets}/${environment.profilePictureBuckets}`

    users$: Observable<Array<User>>

    constructor(
        private jukeboxService: JukeboxService,
        private boxService: BoxService
    ) { }

    ngOnInit() {
        this.jukeboxService.getBox().subscribe(
            (box: Box) => {
                this.box = box
                this.users$ = this.boxService.users(this.box._id)
            }
        )
    }

}
