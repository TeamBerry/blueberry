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
    filteredQueue: Array<QueueItem> = [];

    isLoading = true;
    isFiltering = false;
    filterValue = '';

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

    showFilter() {
        if (this.isFiltering) {
            this.resetFilter();
            this.isFiltering = false;
        } else {
            this.isFiltering = true;
            setTimeout(() => {
                this.bindSearch();
            }, 2000);
        }
    }

    bindSearch() {
        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(500),
                distinctUntilChanged(),
                tap(() => {
                    this.filterValue = this.input.nativeElement.value
                    this.applyFilter()
                })
            )
            .subscribe()
    }

    applyFilter() {
        this.filteredQueue = this.filterValue
            ? this.queue.filter(item => item.video.name.toLowerCase().includes(this.filterValue.toLowerCase()))
            : this.queue
    }

    resetFilter() {
        this.filterValue = ''
        this.input.nativeElement.value = ''
        this.applyFilter()
    }

    /**
     * Subscribe to the box from the jukebox space, to get the playlist when needed
     *
     * @memberof PlaylistComponent
     */
    listen() {
        this.jukeboxService.getQueueStream().subscribe(
            (queue: Array<QueueItem>) => {
                this.queue = [];
                this.filteredQueue = [];

                const currentlyPlaying = queue.find((queueItem) => queueItem.startTime !== null && queueItem.endTime === null);
                const playedVideos = this.buildPartialPlaylist(queue, 'played');
                const upcomingVideos = this.buildPartialPlaylist(queue, 'upcoming');
                const priorityVideos = this.buildPartialPlaylist(queue, 'priority');

                this.queue = this.box.options.loop
                    ? [currentlyPlaying, ...priorityVideos, ...upcomingVideos, ...playedVideos]
                    : [...playedVideos, currentlyPlaying, ...priorityVideos, ...upcomingVideos]

                this.applyFilter()

                this.isLoading = false;
            }
        )
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
            const upcoming = playlist.filter((item: QueueItem) => item.startTime === null && !item.setToNext);
            return upcoming
        }

        if (state === 'played') {
            const played = playlist.filter((item: QueueItem) => item.startTime !== null && item.endTime !== null && !item.setToNext);
            return played
        }

        if (state === 'priority') {
            const priorityVideos = playlist
                .filter(queueItem => queueItem.setToNext)
                .sort((a, b) => +new Date(a.setToNext) - +new Date(b.setToNext))

            this.priorityVideos = priorityVideos

            return priorityVideos;
        }
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
