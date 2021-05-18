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
import { QueueItemActionRequest, QueueItem, VideoSubmissionRequest, BerryCount, Permission } from '@teamberry/muscadine';

@Component({
    selector: 'app-queue',
    templateUrl: './queue.component.html',
    styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit, OnChanges {
    @Input() box: Box = null;
    @Input() user: User = null;
    @Input() permissions: Array<Permission> = [];
    @Input() withHeader = true;
    @ViewChild('filterInput') input: ElementRef;

    queue: Array<QueueItem> = [];

    filterValue = '';

    currentlyPlaying: QueueItem;
    playedVideos: Array<QueueItem>;
    upcomingVideos: Array<QueueItem>;
    priorityVideos: Array<QueueItem>;

    tabSetOptions = [
        { title: `Upcoming`, value: 'upcoming' },
        { title: 'Played', value: 'played' }
    ]
    displayTab: 'upcoming' | 'played' = 'upcoming';

    inAddingProcess = false;

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
        this.jukeboxService.getQueueStream().subscribe(
            (queue: Array<QueueItem>) => {
                this.queue = queue;
                this.currentlyPlaying = queue.find((queueItem) => queueItem.startTime !== null && queueItem.endTime === null);

                this.playedVideos = this.buildPartialPlaylist(queue, 'played');
                this.upcomingVideos = this.buildPartialPlaylist(queue, 'upcoming');

                if (this.box.options.loop) {
                    this.upcomingVideos = [...this.upcomingVideos, ...this.playedVideos]
                }
                this.upcomingVideos = this.putPreselectedFirst(this.upcomingVideos);

                setTimeout(() => {
                    this.bindSearch();
                }, 2000)
            }
        )
    }

    /**
     * Isolates the currently playing video
     *
     * @param playlist The playlist of the box
     * @returns The currently playing video
     * @memberof PlaylistComponent
     */
    getCurrentlyPlayingVideo(playlist: Array<QueueItem>): QueueItem {
        return playlist.find((item: QueueItem) => item.startTime !== null && item.endTime === null);
    }

    /**
     * Builds a partial list of the playlist of the box based on the wanted state of the videos
     *
     * @param playlist The playlist of the box
     * @param state The state of the videos. Upcoming or Played
     * @returns
     * @memberof PlaylistComponent
     */
    buildPartialPlaylist(playlist: Array<QueueItem>, state: string): Array<QueueItem> {
        if (state === 'upcoming') {
            const upcoming = playlist.filter((item: QueueItem) => item.startTime === null);

            this.tabSetOptions[0].title = `Upcoming (${upcoming.length})`
            return upcoming
        }

        if (state === 'played') {
            const played = playlist.filter((item: QueueItem) => item.startTime !== null && item.endTime !== null);
            this.tabSetOptions[1].title = `Played (${played.length})`
            return played
        }
    }

    putPreselectedFirst(playlist: Array<QueueItem>): Array<QueueItem> {
        const priorityVideos = playlist
            .filter(queueItem => queueItem.setToNext)
            .sort((a, b) => +new Date(a.setToNext) - +new Date(b.setToNext))

        this.priorityVideos = priorityVideos;

        const rest = playlist.filter(queueItem => !queueItem.setToNext)

        return [...priorityVideos, ...rest]
    }

    /**
     * Triggered by the order$ event of the playlist item component.
     *
     * @param event
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
                this.jukeboxService.replayVideo(actionRequest)
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
