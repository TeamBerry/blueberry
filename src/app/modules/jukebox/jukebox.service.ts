import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, ReplaySubject, Subject } from 'rxjs';

import io from 'socket.io-client';
import * as _ from 'lodash';

import { environment } from './../../../environments/environment';
import { Box } from 'app/shared/models/box.model';
import { Message, FeedbackMessage, QueueItemActionRequest, SyncPacket, VideoSubmissionRequest, Permission } from '@teamberry/muscadine';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { BerryCount } from '@teamberry/muscadine/dist/interfaces/subscriber.interface';
import { SystemMessage } from '@teamberry/muscadine/dist/models/message.model';
import { RoleChangeRequest } from 'app/shared/models/role-change.model';
import { QueueService } from 'app/shared/services/queue.service';
import { filter, switchMap } from 'rxjs/operators';

export type subjects = Box | Message | FeedbackMessage | SystemMessage | SyncPacket | BerryCount
@Injectable({
    providedIn: 'root'
})
export class JukeboxService {
    private boxSocket;

    /**
     * Replay Subject for components that need to connect to the box stream. The Jukebox Service will connect
     * itself to the server sockets and relay the stream through this Subject. That way, it can inject data
     * in the stream for components. Acts as a middleware.
     *
     * @private
     * @type {ReplaySubject<subjects>}
     * @memberof JukeboxService
     */
    private boxStream: ReplaySubject<subjects> = new ReplaySubject<subjects>();

    /**
     * Subject for every component in the box that will need to do stuff based on the actions of other components.
     * They Jukebox Service provides a stream so all components can tell each other they're doing stuff.
     *
     * Example: A favorite has been removed by the favoritelist component. An order to refresh favorites across the whole
     * ecosystem is sent. The moodwidget might want to check if the video currently playing is still in favorites.
     *
     * @private
     * @type {Subject<string>}
     * @memberof JukeboxService
     */
    private orderStream: Subject<string> = new Subject<string>();

    public box: Box;

    public boxSubject: BehaviorSubject<Box> = new BehaviorSubject<Box>(null);
    public connectionSubject: BehaviorSubject<string> = new BehaviorSubject<string>('offline');

    public user: AuthSubject = AuthService.getAuthSubject();

    constructor(
        private queueService: QueueService
    ) {
    }

    /**
     * Sets the box in memory of the service to provide it to subscribers
     *
     * @param {Box} box
     * @memberof JukeboxService
     */
    public startBox(box: Box) {
        this.box = box;
        this.boxSubject.next(this.box);

        // Connect to socket.
        this.startBoxSocket(box._id, this.user._id).subscribe(
            (message) => {
                this.boxStream.next(message);
            },
            error => {
                console.error(error);
            }
        );

        this.sendBox();
    }

    public getBoxStream(): Observable<any> {
        return this.boxStream.asObservable();
    }

    public getBerryCount() {
        return this.boxStream
            .asObservable()
            .pipe(
                filter(message => 'berries' in message && message.boxToken === this.box._id)
            )
    }

    public getOrderStream(): Observable<string> {
        return this.orderStream.asObservable();
    }

    /**
     * Returns the observable of the box for any component who needs it
     *
     * @returns {Observable<Box>}
     * @memberof JukeboxService
     */
    public getBox(): Observable<Box> {
        return this.boxSubject.asObservable();
    }

    public getConnection(): Observable<string> {
        return this.connectionSubject.asObservable();
    }

    /**
     * Submits a video to the queue of the box
     *
     * @param {VideoSubmissionRequest} video
     * @memberof JukeboxService
     */
    public submitVideo(video: VideoSubmissionRequest): void {
        this.queueService.addVideo(video).subscribe(
            () => {
                console.log('Video added yay')
            }
        )
    }

    /**
     * Submits a playlist to the queue of the box
     *
     * @param {{ playlistId: string, userToken: string, boxToken: string }} playlist
     * @memberof JukeboxService
     */
    public submitPlaylist(playlist: { playlistId: string, userToken: string, boxToken: string }): void {
        this.queueService.addPlaylist(playlist.boxToken, playlist.playlistId).subscribe(
            () => {
                console.log('Add playlist yay')
            }
        )
    }

    /**
     * Cancels a video from the playlist
     *
     * @param {QueueItemActionRequest} actionRequest
     * @memberof JukeboxService
     */
    public cancelVideo = (actionRequest: QueueItemActionRequest): void => {
        this.queueService.removeVideo(actionRequest).subscribe(
            () => {
                console.log('Cancel yay')
            }
        )
    }

    /**
     * Preselects/Unselects a video from the upcoming pool
     *
     * @param {QueueItemActionRequest} actionRequest
     * @memberof JukeboxService
     */
    public preselectVideo = (actionRequest: QueueItemActionRequest): void => {
        this.queueService.playNext(actionRequest).subscribe(
            () => {
                console.log('Play next yay')
            }
        )
    }

    public forcePlayVideo = (actionRequest: QueueItemActionRequest): void => {
        this.queueService.playNow(actionRequest).subscribe(
            () => {
                console.log('Play now yay')
            }
        )
    }

    /**
     * Skips the currently playing video.
     *
     * @see JukeboxService.next
     * @memberof JukeboxService
     */
    public skipVideo(): void {
        this.queueService.skipVideo(this.box._id).subscribe(
            () => { console.log('yay') }
        )
    }

    // TODO: The following 2
    public shuffle() {

    }

    public swap() {

    }

    /**
     * Sends a message to the socket
     *
     * @param {Message} message The message to send
     * @memberof JukeboxService
     */
    public postMessageToSocket(message: Message): void {
        this.boxSocket.emit('chat', message);
    }

    /**
     * Allows components to send messages via the box stream
     *
     * @param {Message} message The message to dispatch
     * @memberof JukeboxService
     */
    public postMessageToStream(message: Message): void {
        this.boxStream.next(message);
    }

    // ORDERS
    public sendOrder(order: string) {
        this.emitOrder(order)
    }

    protected emitOrder(order) {
        this.orderStream.next(order)
    }

    /**
     * Sends the updated box to subscribers
     *
     * @memberof JukeboxService
     */
    protected sendBox() {
        this.boxSubject.next(this.box);
    }

    /**
     * Connects to the box socket and start real-time stuff
     *
     * @private Will connect itself to the socket and relay sync packets through the syncStream ReplaySubject
     * @param {string} boxToken The document ID (_id) of the box
     * @param {string} userToken The document ID (_id) of the user
     * @returns
     * @memberof JukeboxService
     */
    private startBoxSocket(boxToken: string, userToken: string) {
        if (this.boxSocket) {
            this.boxSocket.disconnect();
            this.connectionSubject.next('offline');
        }

        this.boxSocket = io(environment.boquila, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionAttempts: 10
        });

        return new Observable<subjects>(observer => {
            this.boxSocket.on('connect', () => {
                this.boxSocket.emit('auth', {
                    origin: 'Blueberry',
                    type: 'sync',
                    boxToken,
                    userToken
                });
                this.connectionSubject.next('pending');
            });

            this.boxSocket.on('permissions', (permissions: Array<string>) => {
                localStorage.setItem('BBOX-Scope', JSON.stringify(permissions));
                // TODO: Refresh without reloading
                if (this.connectionSubject.value === 'success') {
                    setTimeout(() => {
                        window.location.reload();
                    }, 10000);
                }
            });

            this.boxSocket.on('confirm', (feedback: FeedbackMessage) => {
                observer.next(new FeedbackMessage(feedback));
                // Tells the service the user is joining. Response will be on sync
                this.boxSocket.emit('start', {
                    boxToken,
                    userToken
                });
                this.connectionSubject.next('success');
            });

            this.boxSocket.on('denied', (feedback) => {
                observer.error(JSON.parse(feedback));
                this.connectionSubject.next('error');
                // TODO: Add feedback in the chat
            })

            this.boxSocket.on('sync', (syncPacket: SyncPacket) => {
                if (syncPacket.box === this.box._id) {
                    observer.next(syncPacket);
                }
            });

            this.boxSocket.on('next', (box: Box) => {
                if (box._id === this.box._id) {
                    this.sendBox();
                }
            });

            // When the refreshed box is sent by Tamarillo, it is sent to every components that needs it
            this.boxSocket.on('box', (updatedBox: Box) => {
                if (updatedBox._id === this.box._id) {
                    this.box = updatedBox;
                    this.sendBox();
                }
            });

            // On chat. Regular event.
            this.boxSocket.on('chat', (message: Message | FeedbackMessage | SystemMessage) => {
                if (message.scope === this.box._id) {
                    if ('context' in message) {
                        if (message.source === 'system') {
                            observer.next(new SystemMessage(message as SystemMessage));
                        } else {
                            observer.next(new FeedbackMessage(message as FeedbackMessage));
                        }
                    } else {
                        observer.next(new Message(message));
                    }
                }
            });

            this.boxSocket.on('berries', (berryCount: BerryCount) => {
                observer.next(berryCount)
            })

            return () => {
                this.boxSocket.disconnect();
                this.connectionSubject.next('offline');
            };
        });
    }

    // TODO: Link to the rest of the app
    public changeRoleOfUser = (roleChangeRequest: RoleChangeRequest): void => {
        this.boxSocket.emit('roleChange', roleChangeRequest)
    }

    /**
     * Evaluates whether of not the user can execute a command
     *
     * @private
     * @returns {boolean}
     * @memberof JukeboxService
     */
    public evaluateCommandPower(permission: Permission): boolean {
        const permissions: Array<Permission> = JSON.parse(localStorage.getItem('BBOX-Scope'))

        // Send error if the user doing this is not the creator
        if (!permissions.includes(permission)) {
            const message: Message = new Message({
                contents: 'You do not have the power to execute this action.',
                source: 'system',
                scope: this.box._id,
                time: new Date()
            });
            this.boxStream.next(message);
            return false;
        }
        return true
    }
}
