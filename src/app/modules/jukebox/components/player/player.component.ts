import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as _ from 'lodash';

import { JukeboxService } from './../../jukebox.service';

/**
 * The player component of the box. It just recieves the video as an input from the box
 * and sends back outputs when it starts or stops playing, so the box component can ask for
 * what's next.
 *
 * @export
 * @class PlayerComponent
 * @implements {OnInit}
 * @implements {OnChanges}
 */
@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnChanges {
    @Input() boxToken: string;
    @Input() video: any;
    @Output() playing: EventEmitter<any> = new EventEmitter();
    @Output() state: EventEmitter<any> = new EventEmitter();
    private player;
    private playerEvent;
    public height = '100%';
    public width = '100%';

    constructor(
        private jukeboxService: JukeboxService,
    ) { }

    ngOnInit() {
        console.log('Init player...');
    }

    onStateChange(event) {
        this.playerEvent = event.data;
        if (this.playerEvent === 0) { // PLAY ENDED
            this.state.emit(this.playerEvent);
        }
    }

    ngOnChanges(event) {
        console.log('changes detected in the inputs', event);
        if (_.has(event, 'video')) {
            if (event.video.currentValue !== null && event.video.previousValue !== null) {
                console.log('play video yeet', event.video.currentValue);
                this.video = event.video.currentValue;
                this.playVideo();
            }
        }
    }

    /**
     * Fires when the YouTube player is ready. We can only start playing videos once the player
     * is itself ready.
     *
     * @param {any} player
     * @memberof PlayerComponent
     */
    onPlayerReady(player) {
        this.player = player;
        console.log('player is ready');
        this.playVideo();
    }

    /**
     * Starts the video after it detected changes in the video input
     *
     * @memberof PlayerComponent
     */
    playVideo() {
        this.player.loadVideoById(this.video.link);
    }

    pauseVideo() {
        this.player.pauseVideo();
    }
}
