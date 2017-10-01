import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BoxService } from './../../../../shared/services/box.service';
import { PlayerService } from './../../../../shared/services/player.service';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
    @Input() token: string;
    @Output() playing: EventEmitter<any> = new EventEmitter();
    public link;
    private video;
    private player;
    private playerEvent;
    public height = '100%';
    public width = '100%';

    constructor(
        private playerService: PlayerService,
        private boxService: BoxService
    ) { }

    ngOnInit() {
        console.log('Init player...');
    }

    onStateChange(event) {
        this.playerEvent = event.data;
        if (this.playerEvent === 0) {
            this.next();
        }
    }

    onPlayerReady(player) {
        this.player = player;
        if (this.token !== undefined) {
            this.playerService.current(this.token).subscribe(
                data => {
                    if (data) {
                        this.video = data;
                        this.link = data.link;
                        this.playVideo();
                    }
                }
            );
        }
    }

    playVideo() {
        this.player.loadVideoById(this.link);
        this.playing.emit(this.video);
    }

    pauseVideo() {
        this.player.pauseVideo();
    }

    next() {
        this.playerService.next(this.token).subscribe(
            data => {
                if (data !== false) {
                    this.video = data;
                    this.link = data.link;
                    this.playVideo();
                } else {
                    this.video = null;
                    this.playing.emit(this.video);
                }
            }
        );
    }
}
