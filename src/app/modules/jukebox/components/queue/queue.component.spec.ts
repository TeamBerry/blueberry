import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueComponent } from './queue.component';
import { JukeboxService } from '../../jukebox.service';
import { QueueItem } from '@teamberry/muscadine';

describe('PlaylistComponent', () => {
    let component: QueueComponent;
    let fixture: ComponentFixture<QueueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [QueueComponent],
            providers: [JukeboxService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QueueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
