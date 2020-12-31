import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AuthSubject } from 'app/shared/models/session.model';
import { JukeboxService } from '../../jukebox.service';
import { Box } from 'app/shared/models/box.model';
import { QueueItem } from '@teamberry/muscadine';

@Component({
    selector: 'app-search-tab',
    templateUrl: './search-tab.component.html',
    styleUrls: ['./search-tab.component.scss']
})
export class SearchTabComponent implements OnInit, OnChanges {
    @Input() box: Box;
    @Input() user: AuthSubject;

    videosInQueue: Array<string>;
    berriesEnabled: boolean;
    durationRestriction: number;

    displayedTab: 'youtube' | 'playlists' = 'youtube';

    constructor(
        private jukeboxService: JukeboxService
    ) { }

    ngOnInit() {
        this.jukeboxService.getQueueStream().subscribe(
            (queue: Array<QueueItem>) => {
                this.videosInQueue = queue.map((queueItem: QueueItem) => queueItem.video.link)
            }
        )
    }

    ngOnChanges() {
        this.berriesEnabled = this.box.options.berries
        this.durationRestriction = this.box.options.videoMaxDurationLimit;
    }

}
