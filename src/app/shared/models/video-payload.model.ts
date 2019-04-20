export class VideoPayload {
    /**
     * The YouTube uID of the video to add
     *
     * @type {string}
     * @memberof VideoPayload
     */
    link: string;

    /**
     * The document ID of the user who submitted the video
     *
     * @type {string}
     * @memberof VideoPayload
     */
    userToken: string;

    /**
     * The document ID of the box to which the video is added
     *
     * @type {string}
     * @memberof VideoPayload
     */
    boxToken: string;
}