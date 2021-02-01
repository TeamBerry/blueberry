import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { EmojiSearch } from '@ctrl/ngx-emoji-mart';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { fromEvent } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FeedbackMessage, Message, BerryCount, VideoSubmissionRequest } from '@teamberry/muscadine';
import { JukeboxService } from '../../jukebox.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { AuthService } from 'app/core/auth/auth.service';
import { Box } from 'app/shared/models/box.model';

export interface ChatInputOptions {
    searchButton: boolean
    berryCount: boolean
}

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() boxToken: string;
    @Input() options: Partial<ChatInputOptions>
    @Input() contents = '';

    @ViewChild('chatbox') chatbox: ElementRef;
    @ViewChild('emojiTypeahead') emojiTypeahead: NgbDropdown;

    berryCount: number = null;
    user: AuthSubject = AuthService.getAuthSubject();
    box: Box;


    emojiDetectionRegEx = new RegExp(/:[\w]{2,}/, 'gmi');
    emojiReplacementRegEx = new RegExp(/:[\w]{2,}:/, 'gmi');
    emojiResults: Array<EmojiData> = [];

    appliedOptions: ChatInputOptions = {
        searchButton: true,
        berryCount: true
    }

    constructor(
        private jukeboxService: JukeboxService,
        private emojiSearch: EmojiSearch
    ) {
    }

    ngOnInit() {
        this.listen();

        if (this.options) {
            Object.keys(this.options).map(
                (value: string) => {
                    this.appliedOptions[value] = this.options[value] ?? this.appliedOptions[value]
                }
            )
        }
    }

    ngOnChanges() {
        this.listen();
    }

    ngAfterViewInit() {
        if (this.chatbox) {
            this.emojiTypeahead.openChange.subscribe(
                (change: boolean) => {
                    if (!change) {
                        this.chatbox.nativeElement.focus();
                    }
                }
            )

            fromEvent(this.chatbox.nativeElement, 'keyup')
                .pipe(
                    filter(Boolean),
                    debounceTime(200),
                    distinctUntilChanged(),
            )
                .subscribe(() => this.watchContents());
        }
    }

    listen() {
        this.jukeboxService.getBox().subscribe(
            (box: Box) => {
                this.box = box;
            }
        )

        this.jukeboxService.getBoxStream()
            .pipe(
                filter(message => 'berries' in message && message.boxToken === this.box._id)
        )
            .subscribe(
                (contents: BerryCount) => {
                    this.berryCount = contents.berries;
            }
        )
    }

    watchContents() {
        // Reset everything
        if (this.contents.length === 0) {
            this.emojiTypeahead.close();
            return;
        }

        // Replace full emojis
        const emojiToReplace = this.emojiReplacementRegEx.exec(this.contents);
        if (emojiToReplace && emojiToReplace.length > 0) {
            const result: Array<EmojiData> = this.emojiSearch.search(emojiToReplace[0].replace(/:/gi, ''));
            if (result.length > 0) {
                this.contents = this.contents.replace(this.emojiReplacementRegEx, result[0].native);
            }
            this.emojiTypeahead.close();
            return;
        }

        // Search for emojis to typeahead
        const emojiToSearch = this.emojiDetectionRegEx.exec(this.contents);
        if (emojiToSearch && emojiToSearch.length > 0) {
            this.emojiResults = this.emojiSearch.search(emojiToSearch[0].replace(/:/gi, ''));
            this.emojiTypeahead.open();
            return;
        }
    }

    post(event) {
        event.preventDefault();
        // Guard to prevent sending empty messages
        if (this.contents === '' || this.contents.trim() === '') {
            return;
        }

        const contents = this.contents;
        this.contents = '';
        this.emojiResults = [];
        this.handleMessage(contents);
    }

    handleMessage(contents: string) {
        this.emojiTypeahead.close();
        const message = new Message({
            author: { _id: this.user._id },
            contents,
            scope: this.boxToken,
            source: 'human',
        });
        this.jukeboxService.postMessageToSocket(message);
    }

    /**
     * Adds the selected emoji to the contents of the message
     *
     * @param event
     * @memberof PanelComponent
     */
    addEmoji(event) {
        this.contents += ` ${event.emoji.native}`;
    }

    /**
     * Replaces the text by the emoji
     *
     * @param emoji
     * @memberof PanelComponent
     */
    replaceEmoji(emoji: EmojiData) {
        this.contents = this.contents.replace(
            this.emojiDetectionRegEx,
            emoji.native
        )
        this.chatbox.nativeElement.focus();
    }

    refreshChatStatus(event) {
        console.log(event);
    }

    /**
     * Submits a video by its URL. Will control if the url is valid.
     *
     * @param url The YouTube URL of the video.
     * @memberof PanelComponent
     */
    submitVideo(url: string) {
        const reg = new RegExp(/(\?v=([a-z0-9\-\_]+)\&?)|(\.be\/([a-z0-9\-\_]+)\&?)/i);
        const res = reg.exec(url);

        try {
            const video: VideoSubmissionRequest = {
                link: (res[2]) ? res[2] : res[4],
                userToken: this.user._id,
                boxToken: this.boxToken,
            };

            this.jukeboxService.submitVideo(video);
        } catch (error) {
            const message: FeedbackMessage = new FeedbackMessage({
                contents: 'The video URL you submitted is not a valid YouTube URL.',
                scope: this.boxToken,
                time: new Date(),
                context: 'error'
            });
            this.jukeboxService.postMessageToStream(message);
        }
    }
}
