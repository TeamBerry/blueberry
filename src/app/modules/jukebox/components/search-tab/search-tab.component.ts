import { Component, OnInit, Input } from '@angular/core';
import { AuthSubject } from 'app/shared/models/session.model';
import { JukeboxService } from '../../jukebox.service';
import { Box } from 'app/shared/models/box.model';
import { QueueItem } from '@teamberry/muscadine';

@Component({
    selector: 'app-search-tab',
    templateUrl: './search-tab.component.html',
    styleUrls: ['./search-tab.component.scss']
})
export class SearchTabComponent implements OnInit {
    @Input() boxToken: string;
    @Input() user: AuthSubject;

    videosInQueue: Array<string>;
    berriesEnabled: boolean;

    displayedTab: 'youtube' | 'playlists' = 'youtube';

    constructor(
        private jukeboxService: JukeboxService
    ) { }

    ngOnInit() {
        this.jukeboxService.getBox().subscribe(
            (box: Box) => {
                if (box) {
                    this.videosInQueue = box.playlist.map((queueItem: QueueItem) => queueItem.video.link)
                    this.berriesEnabled = box.options.berries
                }
            }
        )
    }

}
