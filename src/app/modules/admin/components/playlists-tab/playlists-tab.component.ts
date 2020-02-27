import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/shared/models/user.model';
import { UserPlaylist } from 'app/shared/models/user-playlist.model';
import { UserService } from 'app/shared/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistFormComponent } from 'app/shared/components/playlist-form/playlist-form.component';
import { PlaylistViewComponent } from 'app/shared/components/playlist-view/playlist-view.component';
import { AuthSubject } from 'app/shared/models/session.model';
import { Video } from 'app/shared/models/video.model';
import { SearchService } from 'app/shared/services/search.service';
import { YoutubeSearchResult, YoutubeSearchVideos } from 'app/shared/models/youtube.model';

@Component({
    selector: 'app-playlists-tab',
    templateUrl: './playlists-tab.component.html',
    styleUrls: ['./playlists-tab.component.scss'],
    providers: [UserService]
})
export class PlaylistsTabComponent implements OnInit {
    public playlists: Array<UserPlaylist>
    user: AuthSubject = AuthService.getAuthSubject();
    selectedPlaylist: UserPlaylist = null;

    searchValue = ''
    errorMessage
    defaultSearchCooldown = 5
    searchTimeoutValue = 5
    searchInterval
    canSearch = true

    searchResults: Array<Video> = []

    inPlaylistOptions = {
        submit: false,
        favorite: false,
        removeFromPlaylist: true
    }

    outPlaylistOptions = {
        submit: false,
        favorite: false,
        addToPlaylist: true
    }

    constructor(
        private modalService: NgbModal,
        private userService: UserService,
        private searchService: SearchService
    ) { }

    ngOnInit() {
        this.userService.playlists(this.user).subscribe(
            (playlists: Array<UserPlaylist>) => {
                this.playlists = playlists;

                if (playlists.length > 0) {
                    this.selectedPlaylist = playlists[0];
                }
            }
        )
    }

    selectPlaylist(playlistId: string) {
        this.selectedPlaylist = this.playlists.find((item: UserPlaylist) => item._id === playlistId)
    }

    checkValidity(): boolean {
        this.errorMessage = ''
        // Length of value
        if (this.searchValue.length < 3) {
            this.errorMessage = 'Your search criteria needs to have at least 3 characters.'
            return false
        }
        // Timeout
        if (this.canSearch === false) {
            // tslint:disable-next-line: max-line-length
            this.errorMessage = `You have to wait at least ${this.defaultSearchCooldown} seconds before two requests. Please wait until you can search again.`
            return false
        }
        return true
    }

    searchYouTube() {
        if (this.checkValidity()) {
            // Reset cooldown
            this.canSearch = false
            this.searchTimeoutValue = this.defaultSearchCooldown
            // Search
            this.searchService.searchOnYoutube(this.searchValue).subscribe(
                (response: YoutubeSearchResult) => {
                    this.searchResults = response.items.map((responseVideo: YoutubeSearchVideos) => {
                        return new Video({
                            _id: null,
                            name: responseVideo.snippet.title,
                            link: responseVideo.id.videoId
                        })
                    })
                    // Cooldown of 5s before allowing a new search
                    this.searchInterval = setInterval(() => {
                        this.searchTimeoutValue--
                        if (this.searchTimeoutValue <= 0) {
                            clearInterval(this.searchInterval)
                            this.canSearch = true
                        }
                    }, 1000);
                },
                (error) => {
                    this.canSearch = true
                }
            )
        }
    }

    resetSearch() {
        this.searchValue = ''
    }

    openCreateModal(playlist?: UserPlaylist) {
        const modalRef = this.modalService.open(PlaylistFormComponent)
        modalRef.componentInstance.title = !playlist ? 'Create a playlist' : `Edit ${playlist.name}`
        modalRef.componentInstance.playlist = playlist
        modalRef.componentInstance.user = this.user
    }

    addVideoToPlaylist(video: Video) {
        this.userService.updatePlaylist({ action: 'add', video: video.link, playlist: this.selectedPlaylist._id })
            .subscribe((updatedPlaylist: UserPlaylist) => {
                this.selectedPlaylist = updatedPlaylist
            })
    }

    removeVideoFromPlaylist(video: Video) {
        this.userService.updatePlaylist({ action: 'remove', video: video.link, playlist: this.selectedPlaylist._id })
            .subscribe((updatedPlaylist: UserPlaylist) => {
                this.selectedPlaylist = updatedPlaylist
            })
    }
}
