import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class Message {
    author: string;
    contents: string;
    source: string;
    scope: string;
    time: any;

    constructor(obj?: any){
        this.author = obj && obj.author || null;
        this.contents = obj && obj.contents || null;
        this.source = obj && obj.source || null;
        this.scope = obj && obj.scope || null;
        this.time = obj && obj.time || moment();
    }
}