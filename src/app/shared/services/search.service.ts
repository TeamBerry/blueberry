import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Video } from '../models/video.model';

@Injectable({
    providedIn: 'root'
})
export class SearchService {

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
    searchOnYoutube(value: string): Observable<Video[]> {
        return this.http.get<Video[]>(`${environment.araza}/search`, {
            params: { value }
        })
    }

}
