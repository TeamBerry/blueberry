/**
 * Packet sent to clients for video sync
 */
export class SyncPacket {
    /**
     * The box Document ID
     *
     * @type {string}
     * @memberof SyncPacket
     */
    box: string;

    /**
     * The video to play to ensure sync
     *
     * @type {*}
     * @memberof SyncPacket
     */
    item: any;
}