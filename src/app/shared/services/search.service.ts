import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { YoutubeSearchResult } from '../models/youtube.model';
import { Observable } from 'rxjs';

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
    searchOnYoutube(value: string): Observable<YoutubeSearchResult> {
        return this.http.get<YoutubeSearchResult>(`${environment.araza}/search`, {
            params: { value }
        })
    }

}
