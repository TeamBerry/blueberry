import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { JukeboxService } from '../../jukebox.service';
import { Box } from '../../../../shared/models/box.model';
import { User } from 'app/shared/models/user.model';
import { PlaylistSelectorComponent } from 'app/shared/components/playlist-selector/playlist-selector.component';
import { BoxService } from 'app/shared/services/box.service';
import { QueueItemActionRequest, QueueItem, VideoSubmissionRequest, BerryCount } from '@teamberry/muscadine';

@Component({
    selector: 'app-queue',
    templateUrl: './queue.component.html',
    styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit, OnChanges {
    @Input() box: Box = null;
    @Input() user: User = new User;

    @ViewChild('filterInput') input: ElementRef;
    filterValue = '';

    currentlyPlaying: QueueItem;
    playedVideos: Array<QueueItem>;
    upcomingVideos: Array<QueueItem>;

    tabSetOptions = [
        { title: `Upcoming`, value: 'upcoming' },
        { title: 'Played', value: 'played' }
    ]
    displayTab: 'upcoming' | 'played' = 'upcoming';

    constructor(
        private jukeboxService: JukeboxService,
        private modalService: NgbModal,
        private boxService: BoxService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.listen();
    }

    ngOnChanges() {
        this.listen();
    }

    ngAfterViewInit() {
        this.bindSearch();
    }

    bindSearch() {
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

    resetFilter() {
        this.filterValue = ''
        this.input.nativeElement.value = ''
    }

    /**
     * Subscribe to the box from the jukebox space, to get the playlist when needed
     *
     * @memberof PlaylistComponent
     */
    listen() {
        this.jukeboxService.getBox().subscribe(
            (box: Box) => {
                this.box = box;
                this.currentlyPlaying = null;
                setTimeout(() => {
                    this.currentlyPlaying = this.getCurrentlyPlayingVideo(this.box.playlist);
                }, 100);
                this.playedVideos = this.buildPartialPlaylist(this.box.playlist, 'played');
                this.upcomingVideos = this.buildPartialPlaylist(this.box.playlist, 'upcoming').reverse();

                if (this.box.options.loop) {
                    this.upcomingVideos = [...this.upcomingVideos, ...this.playedVideos]
                }
                this.upcomingVideos = this.putPreselectedFirst(this.upcomingVideos);
            }
        );
    }

    /**
     * Isolates the currently playing video
     *
     * @param {Array<QueueItem>} playlist The playlist of the box
     * @returns {QueueItem} The currently playing video
     * @memberof PlaylistComponent
     */
    getCurrentlyPlayingVideo(playlist: Array<QueueItem>): QueueItem {
        return playlist.find((item: QueueItem) => {
            return item.startTime !== null && item.endTime === null;
        });
    }

    /**
     * Builds a partial list of the playlist of the box based on the wanted state of the videos
     *
     * @param {Array<QueueItem>} playlist The playlist of the box
     * @param {string} state The state of the videos. Upcoming or Played
     * @returns {Array<QueueItem>}
     * @memberof PlaylistComponent
     */
    buildPartialPlaylist(playlist: Array<QueueItem>, state: string): Array<QueueItem> {
        if (state === 'upcoming') {
            const upcoming = playlist.filter((item: QueueItem) => {
                return item.startTime === null;
            });

            this.tabSetOptions[0].title = `Upcoming (${upcoming.length})`
            return upcoming
        }

        if (state === 'played') {
            const played = playlist.filter((item: QueueItem) => {
                return item.startTime !== null && item.endTime !== null;
            });
            this.tabSetOptions[1].title = `Played (${played.length})`
            return played
        }
    }

    putPreselectedFirst(playlist: Array<QueueItem>): Array<QueueItem> {
        // Put the preselected video first
        const preselectedVideoIndex = playlist.findIndex((item: QueueItem) => item.isPreselected)
        if (preselectedVideoIndex !== -1) {
            const preselectedVideo = playlist[preselectedVideoIndex]
            playlist.splice(preselectedVideoIndex, 1)
            playlist.unshift(preselectedVideo)
        }

        return playlist
    }

    /**
     * Triggered by the order$ event of the playlist item component.
     *
     * @param {*} event
     * @memberof PlaylistComponent
     */
    handlePlaylistOrder(event) {
        const actionRequest: QueueItemActionRequest = {
            item: event.item,
            userToken: this.user._id,
            boxToken: this.box._id
        }

        switch (event.order) {
            case 'replay':
                this.replayVideo(event.item)
                break

            case 'cancel':
                this.jukeboxService.cancelVideo(actionRequest)
                break

            case 'skip':
                this.jukeboxService.skipVideo()
                break

            case 'preselect':
                this.jukeboxService.preselectVideo(actionRequest)
                break

            case 'forcePlay':
                this.jukeboxService.forcePlayVideo(actionRequest)
                break
        }
    }

    /**
     * Triggered by the order$ event of the playlist item component.
     *
     * Resubmits the video in the playlist of the box
     *
     * @param {QueueItem['video']['link']} link The Youtube link of the video
     * @memberof PlaylistComponent
     */
    replayVideo(link: QueueItem['video']['link']) {
        const submissionPayload: VideoSubmissionRequest = {
            link: link,
            userToken: this.user._id,
            boxToken: this.box._id
        };
        this.jukeboxService.submitVideo(submissionPayload);
    }

    swap(video: any, direction: string) {
        const action = {
            room_history_id: video.room_history_id,
            playlist_order: video.playlist_order,
            direction: direction
        };

        this.jukeboxService.swap();
    }

    /**
     * Requests the currently playing video be skipped.
     *
     * @memberof PlaylistComponent
     */
    requestSkip() {

    }

    startConversion() {
        const modalRef = this.modalService.open(PlaylistSelectorComponent);
        modalRef.componentInstance.selectedPlaylist$.subscribe(
            async (playlistId: string) => {
                this.boxService.convert(this.box._id, playlistId).subscribe()
                this.toastr.success('Playlist updated', 'Success')
            }
        )

    }
}
