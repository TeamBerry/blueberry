import { QueueItem } from '@teamberry/muscadine';

export class SubmissionPayload {
    /**
     * The YouTube uID of the video to add
     *
     * @type {QueueItem['video']['link']}
     * @memberof SubmissionPayload
     */
    link: QueueItem['video']['link'];

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
