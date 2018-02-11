import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class Message {
    contents: string;
    time: any;
    type: string;

    constructor(obj?: any){
        this.contents = obj && obj.contents || null;
        this.time = obj && obj.time || moment();
        this.type = obj && obj.type || null;
    }
}