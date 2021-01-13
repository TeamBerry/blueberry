import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChange } from '@angular/core';
import { SyncPacket, PlayingItem } from '@teamberry/muscadine';
import { JukeboxService } from '../../jukebox.service';
import { filter } from 'rxjs/operators';

/**
 * The player component of the box. It just recieves the video as an input from the box
 * and sends back outputs when it starts or stops playing.
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
export class PlayerComponent implements OnInit, OnChanges, OnDestroy {
    @Input() boxToken: string;
    private player: YT.Player;
    public currentVideoDuration: string;
    public playingPosition: number;

    streamSubscription

    constructor(
        private jukeboxService: JukeboxService
    ) { }

    ngOnInit() {
        const tag = document.createElement('script');
        tag.src = 'https:///www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window['onYouTubeIframeAPIReady'] = () => this.createPlayer();
    }

    /**
     * On Changes, stops the video and resubscribes to the jukebox stream with the changed box token
     *
     * @param {{boxToken: SimpleChange}} changes
     * @memberof PlayerComponent
     */
    ngOnChanges(changes: { boxToken: SimpleChange }) {
        if (changes.boxToken.previousValue !== changes.boxToken.currentValue && !changes.boxToken.firstChange) {
            this.boxToken = changes.boxToken.currentValue;
            this.player.stopVideo();
            this.streamSubscription.unsubscribe();
            this.connectToStream();
        }
    }

    /**
     * On destroy, removes everything pertaining to the youtube player. Everything.
     *
     * @memberof PlayerComponent
     */
    ngOnDestroy() {
        window['YT'] = undefined;
        window['yt'] = undefined;
        if (this.streamSubscription) {
            this.streamSubscription.unsubscribe();
        }
        if (this.player) {
            this.player.stopVideo();
            this.player.destroy();
        }
    }

    createPlayer() {
        this.player = new window['YT'].Player('player', {
            videoId: null,
            width: '100%',
            height: '100%',
            playerVars: {
                autoplay: 1,
                controls: 1
            },
            events: {
                'onReady': this.onPlayerReady.bind(this)
            }
        })
    }

    /**
     * Fires when the YouTube player is ready.
     *
     * @param {YT.PlayerEvent} event
     * @memberof PlayerComponent
     */
    onPlayerReady(event: YT.PlayerEvent) {
        this.player = event.target;
        this.connectToStream();
    }

    /**
     * Connects to the jukebox stream to get the video to play
     *
     * @memberof PlayerComponent
     */
    connectToStream() {
        this.streamSubscription = this.jukeboxService.getBoxStream()
            .pipe(
                filter((syncPacket: SyncPacket) => syncPacket.box === this.boxToken)
            )
            .subscribe(
                (syncPacket: SyncPacket) => {
                    this.playVideo(syncPacket.item);
                }
            )
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
     * @param {PlayingItem} video The playlist item to play
     * @memberof PlayerComponent
     */
    playVideo(video: PlayingItem) {
        let startingTime = video?.position ?? 0

        if (startingTime <= 1) {
            startingTime = 0;
        } else {
            startingTime += 0.3;
        }

        this.currentVideoDuration = video.video?.duration;
        this.playingPosition = startingTime;

        this.player.loadVideoById(video.video.link, startingTime);
    }
}
