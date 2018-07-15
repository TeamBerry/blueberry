import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from './../../../environments/environment';

@Injectable()
export class MoodService {
    constructor(private http: Http) { }

    likeVideo(vote: any) { }

    unlikeVideo(id: number) { }

    checkVote(vote: any) { }
}
