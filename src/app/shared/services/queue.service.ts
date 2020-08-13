import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { VideoSubmissionRequest, QueueItemActionRequest } from '@teamberry/muscadine';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

    constructor(
        private http: HttpClient
    ) { }

    addVideo(videoSubmissionRequest: VideoSubmissionRequest) {
        return this.http.post(`${environment.araza}/boxes/${videoSubmissionRequest.boxToken}/queue/video`, {
            link: videoSubmissionRequest.link,
            flag: videoSubmissionRequest.flag
        })
    }

    addPlaylist(boxToken: string, playlist: string) {
        return this.http.post(`${environment.araza}/boxes/${boxToken}/queue/playlist`, { _id: playlist })
    }

    skipVideo(boxToken: string) {
        return this.http.put(`${environment.araza}/boxes/${boxToken}/queue/skip`, {})
    }

    playNext(playNextRequest: QueueItemActionRequest) {
        return this.http.put(`${environment.araza}/boxes/${playNextRequest.boxToken}/queue/${playNextRequest.item}/next`, {})
    }

    playNow(playNowRequest: QueueItemActionRequest) {
        return this.http.put(`${environment.araza}/boxes/${playNowRequest.boxToken}/queue/${playNowRequest.item}/now`, {})
    }

    removeVideo(videoCancelRequest: QueueItemActionRequest) {
        return this.http.delete(`${environment.araza}/boxes/${videoCancelRequest.boxToken}/queue/${videoCancelRequest.item}`)
    }
}
