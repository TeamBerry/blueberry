import { PlaylistVideo } from './playlist-video.model';

export class SubmissionPayload {
    /**
     * The YouTube uID of the video to add
     *
     * @type {PlaylistVideo['video']['link']}
     * @memberof SubmissionPayload
     */
    link: PlaylistVideo['video']['link'];

    /**
     * The document ID of the user who submitted the video
     *
     * @type {string}
     * @memberof SubmissionPayload
     */
    userToken: string;

    /**
     * The document ID of the box to which the video is added
     *
     * @type {string}
     * @memberof SubmissionPayload
     */
    boxToken: string;
}

export class CancelPayload {
    /**
     * Identifier of the playlist item
     *
     * @type {PlaylistVideo['_id']}
     * @memberof CancelPayload
     */
    item: PlaylistVideo['_id'];

    /**
     * Identifier of the user who requested the cancel
     *
     * @type {string}
     * @memberof CancelPayload
     */
    userToken: string;

    /**
     * Identifier of the box of the playlist
     *
     * @type {string}
     * @memberof CancelPayload
     */
    boxToken: string;
}