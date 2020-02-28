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
import { UserPlaylist } from 'app/shared/models/user-playlist.model';

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
    playlists: Array<UserPlaylist>
    selectedPlaylist = null

    filterValue = ''

    constructor(
        private userService: UserService,
        private jukeboxService: JukeboxService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.getPlaylists();
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

    getPlaylists() {
        this.userService.playlists(this.user).subscribe(
            (playlists: Array<UserPlaylist>) => {
                this.playlists = playlists
            }
        )
    }

    selectPlaylist(playlist: UserPlaylist) {
        this.selectedPlaylist = playlist
    }

    /**
     * Gets favorites
     *
     * @memberof FavoriteSearchTabComponent
     */
    getFavorites() {
        this.favorites$ = this.userService.favorites()
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
                    this.getFavorites();
                }
            }
        )
    }

    resetFilter() {
        this.filterValue = ''
        this.input.nativeElement.value = ''
    }
}
