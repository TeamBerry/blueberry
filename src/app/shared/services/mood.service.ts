import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from './../../../environments/environment';

@Injectable()
export class MoodService {
    host: string = environment.apiUrl;

    constructor(private http: Http) { }

    likeVideo(vote: any){
        return this.http.post(this.host + '/moods', vote)
        .map((response: Response) => {
            return response.json();
        });
    }

    unlikeVideo(id: number){
        return this.http.delete(this.host + '/moods/' + id)
        .map((response: Response) => {
            return response.json();
        });
    }

    checkVote(vote: any) {
        return this.http.post(this.host + '/moods/check', vote)
        .map((response: Response) => {
            return response.json();
        });
    }
}
