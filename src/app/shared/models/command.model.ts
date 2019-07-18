import { Injectable } from "@angular/core";

@Injectable()
export class Command {
    keys: Array<string>;
    arguments?: Array<string>;
    description: string;
    staffOnly: boolean;
}