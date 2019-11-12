import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

import { JukeboxService } from './../../jukebox.service';
import { PlaylistVideo } from 'app/shared/models/playlist-video.model';

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
    @Input() video: PlaylistVideo = null;
    @Output() playing: EventEmitter<any> = new EventEmitter();
    @Output() state: EventEmitter<any> = new EventEmitter();
    private player;
    private playerEvent;
    public height = '100%';
    public width = '100%';

    /**
     * indicates if the player is ready to recieve videos and play them or not.
     *
     * Used as a guard against the onChanges hook of the component to avoid errors
     *
     * @private
     * @type {boolean}
     * @memberof PlayerComponent
     */
    private isPlayerReady = false;

    constructor() { }

    ngOnInit() {
        console.log('Init player...');
    }

    ngOnChanges(event) {
        if (this.isPlayerReady) {
            console.log('changes detected in the inputs', event);
            if (_.has(event, 'video')) {
                if (event.video.currentValue !== null) {
                    console.log('play video yeet', event.video.currentValue);
                    this.video = event.video.currentValue;
                    this.playVideo(this.video);
                }
            }
        } else {
            console.log('Player is not ready yet to play videos.');
        }
    }

    onStateChange(event) {
        this.playerEvent = event.data;
        if (this.playerEvent === 0) { // PLAY ENDED
            this.state.emit(this.playerEvent);
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
        this.isPlayerReady = true;
        console.log('player is ready');
        this.state.emit('ready');
    }

    /**
     * Starts the video after it detected changes in the video input, only if
     * the player is ready.
     *
     * Will start the video at the correct number of seconds based on the start time it received, with a grace period being
     * the number of seconds allowed where the video should just start from the beginning
     * if the computed starting time is inferior to this value. This is done to avoid weird video plays in the case
     * of normal auto-play sync. The grace period is of 2 seconds
     *
     * @param {PlaylistVideo} video The playlist item to play
     * @memberof PlayerComponent
     */
    playVideo(video: PlaylistVideo) {
        const now = +moment().format('x');
        let startingTime = (now - video.startTime) / 1000;

        if (startingTime <= 2) {
            startingTime = 0;
        }

        this.player.loadVideoById(video.video.link, startingTime);
    }
}
