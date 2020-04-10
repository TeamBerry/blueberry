import { QueueVideo } from './playlist-video.model';

export class SubmissionPayload {
    /**
     * The YouTube uID of the video to add
     *
     * @type {QueueVideo['video']['link']}
     * @memberof SubmissionPayload
     */
    link: QueueVideo['video']['link'];

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
