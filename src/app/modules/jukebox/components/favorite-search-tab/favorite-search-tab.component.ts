import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, fromEvent } from 'rxjs';
import { debounceTime, filter, distinctUntilChanged, tap } from 'rxjs/operators';

import { User } from 'app/shared/models/user.model';
import { Video } from 'app/shared/models/video.model';
import { JukeboxService } from 'app/modules/jukebox/jukebox.service';
import { LoginFormComponent } from '../../../../shared/components/login-form/login-form.component';
import { SignupFormComponent } from '../../../../shared/components/signup-form/signup-form.component';
import { SubmissionPayload } from 'app/shared/models/playlist-payload.model';
import { UserService } from 'app/shared/services/user.service';
import { AuthSubject } from 'app/shared/models/session.model';

@Component({
    selector: 'app-favorite-search-tab',
    templateUrl: './favorite-search-tab.component.html',
    styleUrls: ['./favorite-search-tab.component.scss'],
})
export class FavoriteSearchTabComponent implements OnInit, AfterViewInit {
    @Input() boxToken: string;
    @Input() user: AuthSubject;
    @ViewChild('filterInput', { static: false }) input: ElementRef

    favorites$: Observable<User['favorites']>
    favorites: User['favorites'];

    filterValue = ''

    constructor(
        private userService: UserService,
        private jukeboxService: JukeboxService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.getFavorites();
        this.listenToOrders();
    }

    ngAfterViewInit() {
        if (!this.user._id.startsWith('user-')) {
            fromEvent(this.input.nativeElement, 'keyup')
                .pipe(
                    filter(Boolean),
                    debounceTime(500),
                    distinctUntilChanged(),
                    tap(() => {
                        this.filterValue = this.input.nativeElement.value
                    })
                )
                .subscribe()
        }
    }

    /**
     * Relays the output event from the video-entry component and submits the video
     * to the box, via the jukebox service method "submitVideo"
     *
     * @param {Video} video The video to submit
     * @memberof FavoriteSearchTabComponent
     */
    submitVideo(video: Video) {
        const submissionPayload: SubmissionPayload = {
            link: video.link,
            userToken: this.user._id,
            boxToken: this.boxToken
        };
        this.jukeboxService.submitVideo(submissionPayload);
    }

    /**
     * Gets favorites
     *
     * @param {Boolean} [refreshCache = false] Whether to fetch from server or not
     * @memberof FavoriteSearchTabComponent
     */
    getFavorites(refreshCache = false) {
        this.userService.favorites(refreshCache).subscribe(
            (favorites) => {
                this.favorites = favorites;

                if (refreshCache === true) {
                    this.jukeboxService.sendOrder('refresh-like');
                }
            }
        )
    }

    openLoginPrompt() {
        this.modalService.open(LoginFormComponent);
    }

    openSignupPrompt() {
        this.modalService.open(SignupFormComponent);
    }

    /**
     * Listens to the jukebox service for orders
     *
     * @memberof FavoriteSearchTabComponent
     */
    listenToOrders() {
        this.jukeboxService.getOrderStream().subscribe(
            (order: string) => {
                if (order === 'favorites') {
                    this.getFavorites(true);
                }
            }
        )
    }

    resetFilter() {
        this.filterValue = ''
        this.input.nativeElement.value = ''
    }
}
