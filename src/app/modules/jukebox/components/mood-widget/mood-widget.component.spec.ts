import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodWidgetComponent } from './mood-widget.component';

describe('MoodWidgetComponent', () => {
    let component: MoodWidgetComponent;
    let fixture: ComponentFixture<MoodWidgetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MoodWidgetComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MoodWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('can like a video', () => {

    })

    it('can unlike a video', () => {

    })
});
