import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Badge } from '../models/badge.model';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {

    constructor(
        private http: HttpClient
    ) { }

    index(): Observable<Badge[]> {
        return this.http.get<Badge[]>(`${environment.araza}/badges`)
    }

}
