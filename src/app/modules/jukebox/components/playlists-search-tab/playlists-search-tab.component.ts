import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, fromEvent } from 'rxjs';
import { debounceTime, filter, distinctUntilChanged, tap } from 'rxjs/operators';

import { User } from 'app/shared/models/user.model';
import { Video } from 'app/shared/models/video.model';
import { JukeboxService } from 'app/modules/jukebox/jukebox.service';
import { LoginFormComponent } from '../../../../shared/components/login-form/login-form.component';
import { SignupFormComponent } from '../../../../shared/components/signup-form/signup-form.component';
import { UserService } from 'app/shared/services/user.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { UserPlaylist } from 'app/shared/models/user-playlist.model';
import { Permission, VideoSubmissionRequest } from '@teamberry/muscadine';

@Component({
    selector: 'app-playlists-search-tab',
    templateUrl: './playlists-search-tab.component.html',
    styleUrls: ['./playlists-search-tab.component.scss'],
})
export class PlaylistsSearchTabComponent implements OnInit, AfterViewInit {
    @Input() boxToken: string;
    @Input() user: AuthSubject;
    @Input() videosInQueue: Array<string>;
    @Input() berriesEnabled: boolean;
    @Input() permissions: Array<Permission> = [];
    @ViewChild('filterInput') input: ElementRef

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
        this.bindSearch();
    }

    bindSearch() {
        if (!this.user._id.startsWith('user-') && this.selectedPlaylist !== null) {
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
     * @param video The video to submit
     * @memberof FavoriteSearchTabComponent
     */
    submitVideo(event: { video: Video, flag?: 'next' | 'now'}) {
        const submissionPayload: VideoSubmissionRequest = {
            link: event.video.link,
            userToken: this.user._id,
            boxToken: this.boxToken,
            flag: event?.flag
        };
        this.jukeboxService.submitVideo(submissionPayload);
    }

    submitPlaylist(playlistId: string) {
        this.jukeboxService.submitPlaylist({
            playlistId,
            userToken: this.user._id,
            boxToken: this.boxToken
        })
    }

    async getPlaylists() {
        this.playlists = await this.userService.playlists(this.user).toPromise()
    }

    selectPlaylist(playlist: UserPlaylist) {
        this.selectedPlaylist = playlist
        this.filterValue = ''
        setTimeout(() => this.bindSearch(), 100)
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
                    this.getPlaylists();
                }
            }
        )
    }

    resetFilter() {
        this.filterValue = ''
        this.input.nativeElement.value = ''
    }
}
