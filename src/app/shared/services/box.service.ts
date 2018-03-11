import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { environment } from './../../../environments/environment';
import { Box } from './../models/box.model';

@Injectable()
export class BoxService {

    constructor(private http: Http) { }

    list() {
        return this.http.get(environment.chronosUrl + '/box')
            .map((response: Response) => {
                const boxes: Box[] = [];
                response.json().forEach((box) => {
                    boxes.push(new Box(box));
                });
                return boxes;
            });
    }

    show(id: string) {
        return this.http.get(environment.chronosUrl + '/box/' + id)
            .map((response: Response) => {
                return response.json();
            });
    }

    store(box: Box) {
        return this.http.post(environment.chronosUrl + '/box', box)
            .map((response: Response) => {
                return response.json();
            });
    }
}
