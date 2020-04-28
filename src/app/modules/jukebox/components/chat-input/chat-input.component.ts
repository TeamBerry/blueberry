import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji/public_api';
import { JukeboxService } from '../../jukebox.service';
import { ToastrService } from 'ngx-toastr';
import { EmojiSearch } from '@ctrl/ngx-emoji-mart';
import { fromEvent } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubmissionPayload } from 'app/shared/models/playlist-payload.model';
import { FeedbackMessage, Message, BerryCount } from '@teamberry/muscadine';
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
export class ChatInputComponent implements OnInit, OnChanges {
    @Input() boxToken: string;
    @Input() options: Partial<ChatInputOptions>
    berryCount: number = null;
    user: AuthSubject = AuthService.getAuthSubject();
    box: Box;

    @Output() command = new EventEmitter();

    contents = '';
    hasCommand = false;

    /**
     * Whether the emoji picker is displayed
     *
     * @memberof PanelComponent
     */
    isEmojiPickerDisplayed = false;

    @ViewChild('chatbox') chatbox: ElementRef;
    @ViewChild('emojiPicker') emojiPicker: ElementRef;
    @ViewChild('emojiButton') emojiButton: ElementRef;
    @ViewChild('emojiTypeahead') emojiTypeahead: NgbDropdown;

    emojiDetectionRegEx = new RegExp(/:[\w]{2,}/, 'gmi');
    emojiReplacementRegEx = new RegExp(/:[\w]{2,}:/, 'gmi');
    emojiResults: Array<EmojiData> = [];

    appliedOptions: ChatInputOptions = {
        searchButton: true,
        berryCount: true
    }

    constructor(
        private modalService: NgbModal,
        private jukeboxService: JukeboxService,
        private toastr: ToastrService,
        private renderer: Renderer2,
        private emojiSearch: EmojiSearch
    ) {
        // Will close the emoji picker when a click is registered outside of the chatbox, the emoji button and picker
        this.renderer.listen('window', 'click', (e: Event) => {
            if (e.target !== this.chatbox.nativeElement
                && e.target !== this.emojiButton.nativeElement
                && e.composedPath().indexOf(this.emojiPicker.nativeElement) === -1
            ) {
                this.isEmojiPickerDisplayed = false;
            }
        })
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
        this.hasCommand = false;
        if (this.contents.length === 0) {
            this.emojiTypeahead.close();
            return;
        }

        // Switch to command mode
        if (this.contents.indexOf('!') === 0) {
            this.hasCommand = true;
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
        const contents = this.contents;
        this.contents = '';
        this.emojiResults = [];
        if (this.hasCommand && !event.ctrlKey) {
            this.handleCommands(contents);
        } else {
            this.handleMessage(contents);
        }
    }

    handleMessage(contents: string) {
        this.isEmojiPickerDisplayed = false;
        this.emojiTypeahead.close();
        const message = new Message({
            author: this.user._id,
            contents: contents,
            scope: this.boxToken,
            source: 'human',
        });
        this.jukeboxService.postMessageToSocket(message);
    }

    /**
     * Adds the selected emoji to the contents of the message
     *
     * @param {*} event
     * @memberof PanelComponent
     */
    addEmoji(event) {
        this.contents += ` ${event.emoji.native}`;
    }

    /**
     * Replaces the text by the emoji
     *
     * @param {EmojiData} emoji
     * @memberof PanelComponent
     */
    replaceEmoji(emoji: EmojiData) {
        this.contents = this.contents.replace(
            this.emojiDetectionRegEx,
            emoji.native
        )
        this.chatbox.nativeElement.focus();
    }

    /**
     * Kickstarts the use of a command in the chat when a command is clicked in the command list component
     *
     * @param {string} commandKey
     * @memberof PanelComponent
     */
    kickstartCommand(commandKey: string) {
        this.contents += `!${commandKey} `;
        this.watchContents();
    }

    handleCommands(contents: string) {
        // Trim multiple spaces in commands
        contents = contents.replace(/(\s)+/gm, ' ');
        const command = contents.substr(1).split(' ');
        const keyword = command[0];
        switch (keyword) {
            case 'add':
            case 'play':
                this.submitVideo(command[1]);
                break;

            case 'skip':
            case 'next':
                this.jukeboxService.skipVideo();
                break;

            case 'shuffle':
            case 'random':
                /* this.shuffle(); */
                break;

            // "Exterior commands"
            case 'queue':
            case 'settings':
            case 'help':
            case 'chat':
            case 'playlist':
            case 'users':
            case 'userlist':
            case 'search':
            case 'commands':
            case 'macros':
                this.command.emit(keyword);
                break;

            default:
                break;
        }
    }

    refreshChatStatus(event) {
        console.log(event);
    }

    /**
     * Submits a video by its URL. Will control if the url is valid.
     *
     * @param {string} url The YouTube URL of the video.
     * @memberof PanelComponent
     */
    submitVideo(url: string) {
        const reg = new RegExp(/(\?v=([a-z0-9\-\_]+)\&?)|(\.be\/([a-z0-9\-\_]+)\&?)/i);
        const res = reg.exec(url);

        try {
            const video: SubmissionPayload = {
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

    showPanel(panel: string) {
        this.command.emit(panel);
    }
}
