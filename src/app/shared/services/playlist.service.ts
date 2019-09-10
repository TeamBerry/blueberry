import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserPlaylist } from '../models/user-playlist.model';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PlaylistService {

    constructor(
        private http: HttpClient
    ) { }

    /**
     * Gets all public playlists
     *
     * @returns {Observable<Array<UserPlaylist>>} The list of public playlists
     * @memberof PlaylistService
     */
    index(): Observable<Array<UserPlaylist>> {
        return this.http.get<Array<UserPlaylist>>(`${environment.araza}/playlists`);
    }

    /**
     * Gets one playlist
     *
     * @param {string} id The ObjectId of the playlist
     * @returns {Observable<UserPlaylist>}
     * @memberof PlaylistService
     */
    show(id: string): Observable<UserPlaylist> {
        return this.http.get<UserPlaylist>(`${environment.araza}/playlists/${id}`);
    }

    /**
     * Stores a new playlist in the database
     *
     * @param {Partial<UserPlaylist>} playlist
     * @returns {Observable<UserPlaylist>}
     * @memberof PlaylistService
     */
    store(playlist: Partial<UserPlaylist>): Observable<UserPlaylist>{
        return this.http.post<UserPlaylist>(`${environment.araza}/playlists`, playlist);
    }

    /**
     * Updates a playlist
     *
     * @param {Partial<UserPlaylist>} playlist
     * @returns {Observable<UserPlaylist>}
     * @memberof PlaylistService
     */
    update(playlist: Partial<UserPlaylist>): Observable<UserPlaylist> {
        return this.http.put<UserPlaylist>(`${environment.araza}/playlists/${playlist._id}`, playlist);
    }

    /**
     * Deletes a playlist
     *
     * @param {string} id
     * @returns {Observable<UserPlaylist>}
     * @memberof PlaylistService
     */
    delete(id: string): Observable<UserPlaylist> {
        return this.http.delete<UserPlaylist>(`${environment.araza}/playlists/${id}`);
    }
}
