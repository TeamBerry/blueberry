import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, ReplaySubject, Subject } from 'rxjs';

import { io, Socket } from 'socket.io-client';

import { environment } from './../../../environments/environment';
import { Box } from 'app/shared/models/box.model';
import {
    Message, FeedbackMessage, QueueItemActionRequest, SyncPacket, VideoSubmissionRequest, Permission, QueueItem
} from '@teamberry/muscadine';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { BerryCount } from '@teamberry/muscadine/dist/interfaces/subscriber.interface';
import { SystemMessage } from '@teamberry/muscadine/dist/models/message.model';
import { RoleChangeRequest } from 'app/shared/models/role-change.model';
import { QueueService } from 'app/shared/services/queue.service';
import { filter } from 'rxjs/operators';

export type Subjects = Box | Message | FeedbackMessage | SystemMessage | SyncPacket | BerryCount | Array<Permission>
@Injectable({
    providedIn: 'root'
})
export class JukeboxService {
    public box: Box;

    public boxSubject: BehaviorSubject<Box> = new BehaviorSubject<Box>(null);
    public connectionSubject: BehaviorSubject<string> = new BehaviorSubject<string>('offline');
    public permissionsSubject: BehaviorSubject<Array<Permission>> = new BehaviorSubject<Array<Permission>>([]);

    public user: AuthSubject = AuthService.getAuthSubject();

    private boxSocket: Socket;

    /**
     * Replay Subject for components that need to connect to the box stream. The Jukebox Service will connect
     * itself to the server sockets and relay the stream through this Subject. That way, it can inject data
     * in the stream for components. Acts as a middleware.
     *
     * @private
     * @type {ReplaySubject<Subjects>}
     * @memberof JukeboxService
     */
    private boxStream: ReplaySubject<Subjects> = new ReplaySubject<Subjects>();
    private queueStream: ReplaySubject<Array<QueueItem>> = new ReplaySubject<Array<QueueItem>>();

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

    constructor(
        private queueService: QueueService
    ) {}

    /**
     * Sets the box in memory of the service to provide it to subscribers
     *
     * @param box
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

    public getQueueStream(): Observable<any> {
        return this.queueStream.asObservable();
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
     * @returns
     * @memberof JukeboxService
     */
    public getBox(): Observable<Box> {
        return this.boxSubject.asObservable();
    }

    public getConnection(): Observable<string> {
        return this.connectionSubject.asObservable();
    }

    public getPermissions(): Observable<Array<Permission>> {
        return this.permissionsSubject.asObservable();
    }

    /**
     * Submits a video to the queue of the box
     *
     * @param video
     * @memberof JukeboxService
     */
    public submitVideo(video: VideoSubmissionRequest): void {
        this.queueService.addVideo(video).subscribe()
    }

    /**
     * Submits a playlist to the queue of the box
     *
     * @param playlist
     * @memberof JukeboxService
     */
    public submitPlaylist(playlist: { playlistId: string, userToken: string, boxToken: string }): void {
        this.queueService.addPlaylist(playlist.boxToken, playlist.playlistId).subscribe()
    }

    /**
     * Cancels a video from the playlist
     *
     * @param actionRequest
     * @memberof JukeboxService
     */
    public cancelVideo = (actionRequest: QueueItemActionRequest): void => {
        this.queueService.removeVideo(actionRequest).subscribe()
    }

    /**
     * Preselects/Unselects a video from the upcoming pool
     *
     * @param actionRequest
     * @memberof JukeboxService
     */
    public preselectVideo = (actionRequest: QueueItemActionRequest): void => {
        this.queueService.playNext(actionRequest).subscribe()
    }

    public forcePlayVideo = (actionRequest: QueueItemActionRequest): void => {
        this.queueService.playNow(actionRequest).subscribe()
    }

    public replayVideo = (actionRequest: QueueItemActionRequest): void => {
        this.queueService.replayVideo(actionRequest).subscribe()
    }

    /**
     * Skips the currently playing video.
     *
     * @see JukeboxService.next
     * @memberof JukeboxService
     */
    public skipVideo(): void {
        this.queueService.skipVideo(this.box._id).subscribe()
    }

    /**
     * Sends a message to the socket
     *
     * @param message The message to send
     * @memberof JukeboxService
     */
    public postMessageToSocket(message: Message): void {
        this.boxSocket.emit('chat', message);
    }

    /**
     * Allows components to send messages via the box stream
     *
     * @param message The message to dispatch
     * @memberof JukeboxService
     */
    public postMessageToStream(message: Message): void {
        this.boxStream.next(message);
    }

    // ORDERS
    public sendOrder(order: string) {
        this.emitOrder(order)
    }

    public changeRoleOfUser = (roleChangeRequest: RoleChangeRequest): void => {
        this.boxSocket.emit('roleChange', roleChangeRequest)
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
     * @param boxToken The document ID (_id) of the box
     * @param userToken The document ID (_id) of the user
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

        return new Observable<Subjects>(observer => {
            this.boxSocket.on('connect', () => {
                this.boxSocket.emit('auth', {
                    origin: 'Blueberry',
                    type: 'sync',
                    boxToken,
                    userToken
                });
                this.connectionSubject.next('pending');
            });

            this.boxSocket.on('permissions', (permissions: Array<Permission>) => {
                this.permissionsSubject.next(permissions);
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

            this.boxSocket.on('queue', (queue: Array<QueueItem>) => {
                this.queueStream.next(queue);
            })

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
}
