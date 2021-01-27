import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Badge } from 'app/shared/models/badge.model';
import { AuthSubject } from 'app/shared/models/session.model';
import { User } from 'app/shared/models/user.model';
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
    userBadges: User["badges"] = []
    userBadgeIds: Array<string> = []
    user: AuthSubject = AuthService.getAuthSubject();

    constructor(
        private http: HttpClient,
        private badgeService: BadgeService,
        private userService: UserService
    ) { }

    ngOnInit() {
        forkJoin([
            this.http.get<User>(`${environment.araza}/users/me`),
            this.http.get<Badge[]>(`${environment.araza}/badges`)
        ]).subscribe(
            (result: [User, Badge[]]) => {
                this.userBadges = result[0].badges;
                this.userBadgeIds = result[0].badges.map((ub) => ub.badge)
                this.badges = result[1];
            }
        )
    }

    selectBadge(badge: string) {
        this.userService.updateSettings({ badge }).subscribe(
            () => {
                this.user.settings.badge = badge
                localStorage.setItem('BBOX-user', JSON.stringify(this.user));
            }
        );
    }

    isUnlocked(badge: string): boolean {
        return this.userBadgeIds.includes(badge)
    }

    isDisplayed(badge: string): boolean {
        return this.user.settings.badge === badge
    }

    matchingBadge(badge: Badge): User["badges"][0] {
        return this.userBadges.find((ub) => ub.badge === badge._id)
    }
}
