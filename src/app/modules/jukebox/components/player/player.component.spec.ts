import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerComponent } from './player.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { JukeboxService } from '../../jukebox.service';

fdescribe('PlayerComponent', () => {
    let component: PlayerComponent;
    let fixture: ComponentFixture<PlayerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PlayerComponent],
            providers: [
                JukeboxService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
