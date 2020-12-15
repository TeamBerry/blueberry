import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Badge } from 'app/shared/models/badge.model';
import { AuthSubject } from 'app/shared/models/session.model';
import { BadgeService } from 'app/shared/services/badge.service';
import { UserService } from 'app/shared/services/user.service';
import { environment } from 'environments/environment';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-badge-collection',
    templateUrl: './badge-collection.component.html',
    styleUrls: ['./badge-collection.component.scss'],
    providers: [UserService]
})
export class BadgeCollectionComponent implements OnInit {
    badges: Array<Badge> = []
    userBadges = []
    user: AuthSubject = AuthService.getAuthSubject();

    constructor(
        private http: HttpClient,
        private badgeService: BadgeService,
        private userService: UserService
    ) { }

    ngOnInit() {
        forkJoin([
            this.http.get<any[]>(`${environment.araza}/users/${this.user._id}/badges`),
            this.http.get<Badge[]>(`${environment.araza}/badges`)
        ]).subscribe(
            (result) => {
                this.userBadges = result[0];
                this.badges = result[1];
            }
        )
    }

    selectBadge(badge: string) {
        this.userService.updateSettings({ badge }).subscribe();
    }
}
