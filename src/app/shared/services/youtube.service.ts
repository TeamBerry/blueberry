import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { YoutubeSearchResult } from '../models/youtube.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    constructor(
        private http: HttpClient
    ) { }

    /**
     * Uses the search API of YouTube to fetch videos
     *
     * @param {string} value
     * @returns
     * @memberof YoutubeService
     */
    search(value: string): Observable<YoutubeSearchResult> {
        // tslint:disable-next-line: max-line-length
        return this.http.get<YoutubeSearchResult>(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${value}&type=video&key=${environment.youtubeApiKey}`)
    }

}
