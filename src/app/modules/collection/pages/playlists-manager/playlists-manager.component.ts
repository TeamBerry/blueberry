import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'app/core/auth/auth.service';
import { UserPlaylist } from 'app/shared/models/user-playlist.model';
import { UserService } from 'app/shared/services/user.service';
import { PlaylistFormComponent } from 'app/shared/components/playlist-form/playlist-form.component';
import { AuthSubject } from 'app/shared/models/session.model';
import { Video } from 'app/shared/models/video.model';
import { SearchService } from 'app/shared/services/search.service';
import { ToastrService } from 'ngx-toastr';
import { PlaylistService } from 'app/shared/services/playlist.service';

@Component({
    selector: 'app-playlists-manager',
    templateUrl: './playlists-manager.component.html',
    styleUrls: ['./playlists-manager.component.scss'],
    providers: [UserService]
})
export class PlaylistsManagerComponent implements OnInit {
    public playlists: Array<UserPlaylist> = [];
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
        removeFromPlaylist: true
    }

    outPlaylistOptions = {
        submit: false,
        addToPlaylist: true
    }

    constructor(
        private modalService: NgbModal,
        private userService: UserService,
        private playlistService: PlaylistService,
        private searchService: SearchService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.getPlaylists()
    }

    getPlaylists() {
        this.userService.playlists(this.user).subscribe(
            (playlists: Array<UserPlaylist>) => {
                this.playlists = playlists;

                if (!this.selectedPlaylist && playlists.length > 0) {
                    this.selectedPlaylist = playlists[0];
                }
            }
        )
    }

    selectPlaylist(playlistId: string) {
        if (this.selectedPlaylist._id !== playlistId) {
            this.selectedPlaylist = this.playlists.find((item: UserPlaylist) => item._id === playlistId)
        }
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
            // eslint-disable-next-line max-len
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
                (videos: Array<Video>) => {
                    this.searchResults = videos;
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
        modalRef.componentInstance.playlist = playlist ? Object.assign({}, playlist) : null
        modalRef.componentInstance.user = this.user
        modalRef.componentInstance.playlistSaved.subscribe(
            () => {
                const message = playlist ? 'Playlist updated' : 'Playlist created';
                this.toastr.success(message, 'Success')
                this.getPlaylists()
            }
        )
    }

    addVideoToPlaylist(video) {
        const videoPacket = video._id ? { videoId: video._id } : { videoLink: video.link }

        this.playlistService.addVideoToPlaylist(this.selectedPlaylist._id, videoPacket)
            .subscribe((updatedPlaylist: UserPlaylist) => {
                this.toastr.success('Video added to the playlist', 'Success')
                const playlistIndex = this.playlists.findIndex((playlist) => updatedPlaylist._id === playlist._id);
                this.playlists[playlistIndex] = updatedPlaylist
                this.selectedPlaylist = updatedPlaylist
            })
    }

    removeVideoFromPlaylist(video: Video) {
        this.playlistService.removeVideoFromPlaylist(this.selectedPlaylist._id, video._id)
            .subscribe((updatedPlaylist: UserPlaylist) => {
                this.toastr.success('Video removed from the playlist', 'Success')
                const playlistIndex = this.playlists.findIndex((playlist) => updatedPlaylist._id === playlist._id);
                this.playlists[playlistIndex] = updatedPlaylist
                this.selectedPlaylist = updatedPlaylist
            })
    }

    deletePlaylist() {
        this.playlistService.delete(this.selectedPlaylist._id)
            .subscribe(() => {
                this.toastr.success('Playlist deleted', 'Success')
                let playlistIndex = this.playlists.findIndex((playlist) => this.selectedPlaylist._id === playlist._id);
                this.playlists.splice(playlistIndex, 1)
                if (playlistIndex === 0) {
                    this.selectedPlaylist = this.playlists[0]
                } else {
                    this.selectedPlaylist = this.playlists[--playlistIndex]
                }
            })
    }
}
