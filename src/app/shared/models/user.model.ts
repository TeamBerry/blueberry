import { Injectable } from "@angular/core";

@Injectable()
export class User {
    _id: string;
    name: string;
    token: string;
    mail: string;
    settings: {};
    favorites: string[];

    constructor(obj?: any) {
        this._id = obj && obj._id || null;
        this.name = obj && obj.name || null;
        this.token = obj && obj.token || null;
        this.mail = obj && obj.mail || null;
        this.settings = obj && obj.settings || {
            messagedByEveryone: true,
            messagedByFriends: true,
            messagedByBoxMembers: true,
            invitedByEveryone: true,
            invitedByFriendsOfFriends: true,
            invitedByBoxMembers: true,
            inAppNotifications: true,
            desktopNotifications: true,
            friendRequestReceived: true,
            directMessageReceived: true,
            boxOpenedByFriend: true,
            darkTheme: true
        }
        this.favorites = obj && obj.favorites || [];
    }
}
