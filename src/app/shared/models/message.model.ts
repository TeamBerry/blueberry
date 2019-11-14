import { Injectable } from '@angular/core';

@Injectable()
export class Message {
    author: string;
    contents: string;
    source: string;
    scope: string;
    time: Date;

    constructor(obj?: any) {
        this.author = obj && obj.author || null;
        this.contents = obj && obj.contents || null;
        this.source = obj && obj.source || null;
        this.scope = obj && obj.scope || null;
        this.time = obj && obj.time || new Date();
    }
}