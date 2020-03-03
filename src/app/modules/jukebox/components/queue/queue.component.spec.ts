import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueComponent } from './queue.component';
import { JukeboxService } from '../../jukebox.service';
import { QueueVideo } from 'app/shared/models/playlist-video.model';

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

    describe('Builds the parts of the playlist', () => {
        const playlist: Array<QueueVideo> = [
            {
                '_id': '5cb98fb0b7452c6b3cbfd5c5',
                'video': {
                    '_id': '5cb447c0770fb93a7020610b',
                    'link': 'UOxkGD8qRB4',
                    'name': 'K/DA - POP/STARS (ft Madison Beer, (G)I-DLE, Jaira Burns) | Official Music Video - League of Legends',
                },
                'startTime': null,
                'endTime': null,
                'submittedAt': 1555664816009,
                'submitted_by': {
                    '_id': '5cb323d9c403e73a69a5a7b0',
                    'name': 'AngelZatch'
                }
            },
            {
                '_id': '5cb98fabb7452c6b3cbfd556',
                'video': {
                    '_id': '5cb32f4f770fb93a70205ec2',
                    'link': 'P_CSdxSGfaA',
                    'name': 'wowaka 『アンノウン・マザーグース』feat. 初音ミク / wowaka - Unknown Mother-Goose (Official Video) ft. Hatsune Miku',
                },
                'startTime': 1555664811319,
                'endTime': null,
                'submittedAt': 1555664811232,
                'submitted_by': {
                    '_id': '5cb323d9c403e73a69a5a7b0',
                    'name': 'AngelZatch'
                }
            },
            {
                '_id': '5cb98c44b7452c6b3cbfd4b3',
                'video': {
                    '_id': '5cb4370d770fb93a70205edc',
                    'link': 'b_cuMcDWwsI',
                    'name': 'wowaka 『裏表ラバーズ』feat. 初音ミク / wowaka - Ura-Omote Lovers (Official Video) ft. Hatsune Miku',
                },
                'startTime': 1555663940928,
                'endTime': 1555664132311,
                'submittedAt': 1555663940816,
                'submitted_by': {
                    '_id': '5cb323d9c403e73a69a5a7b0',
                    'name': 'AngelZatch'
                }
            },
            {
                '_id': '5cb98561b7452c6b3cbfd413',
                'video': {
                    '_id': '5cb98561b7452c6b3cbfd412',
                    'link': 't8WuKJa6L5E',
                    'name': '[ANIMATION] ~ ♫ All Eyes On Me ♫ ~ Cover by Victor McKnight & SquigglyDigg',
                },
                'startTime': 1555662177632,
                'endTime': 1555662437877,
                'submittedAt': 1555662177576,
                'submitted_by': {
                    '_id': '5cb323d9c403e73a69a5a7b0',
                    'name': 'AngelZatch'
                }
            },
            {
                '_id': '5cb982b3b7452c6b3cbfd341',
                'video': {
                    '_id': '5cb43b64770fb93a70205f23',
                    'link': 'TAjrPYzqs2w',
                    'name': 'KIRA - Machine Gun ft. GUMI English (Original Song)',
                },
                'startTime': 1555661927247,
                'endTime': 1555662154866,
                'submittedAt': 1555661491376,
                'submitted_by': {
                    '_id': '5cb323d9c403e73a69a5a7b0',
                    'name': 'AngelZatch'
                }
            },
        ];
        it('Can isolate the currently playing video', () => {
            const expected: QueueVideo = {
                '_id': '5cb98fabb7452c6b3cbfd556',
                'video': {
                    '_id': '5cb32f4f770fb93a70205ec2',
                    'link': 'P_CSdxSGfaA',
                    'name': 'wowaka 『アンノウン・マザーグース』feat. 初音ミク / wowaka - Unknown Mother-Goose (Official Video) ft. Hatsune Miku',
                },
                'startTime': 1555664811319,
                'endTime': null,
                'submittedAt': 1555664811232,
                'submitted_by': {
                    '_id': '5cb323d9c403e73a69a5a7b0',
                    'name': 'AngelZatch'
                }
            };

            expect(component.getCurrentlyPlayingVideo(playlist)).toEqual(expected);
        });

        it('Can build the list of already played videos', () => {
            const expected: Array<QueueVideo> = [
                {
                    '_id': '5cb98c44b7452c6b3cbfd4b3',
                    'video': {
                        '_id': '5cb4370d770fb93a70205edc',
                        'link': 'b_cuMcDWwsI',
                        'name': 'wowaka 『裏表ラバーズ』feat. 初音ミク / wowaka - Ura-Omote Lovers (Official Video) ft. Hatsune Miku',
                    },
                    'startTime': 1555663940928,
                    'endTime': 1555664132311,
                    'submittedAt': 1555663940816,
                    'submitted_by': {
                        '_id': '5cb323d9c403e73a69a5a7b0',
                        'name': 'AngelZatch'
                    }
                },
                {
                    '_id': '5cb98561b7452c6b3cbfd413',
                    'video': {
                        '_id': '5cb98561b7452c6b3cbfd412',
                        'link': 't8WuKJa6L5E',
                        'name': '[ANIMATION] ~ ♫ All Eyes On Me ♫ ~ Cover by Victor McKnight & SquigglyDigg',
                    },
                    'startTime': 1555662177632,
                    'endTime': 1555662437877,
                    'submittedAt': 1555662177576,
                    'submitted_by': {
                        '_id': '5cb323d9c403e73a69a5a7b0',
                        'name': 'AngelZatch'
                    }
                },
                {
                    '_id': '5cb982b3b7452c6b3cbfd341',
                    'video': {
                        '_id': '5cb43b64770fb93a70205f23',
                        'link': 'TAjrPYzqs2w',
                        'name': 'KIRA - Machine Gun ft. GUMI English (Original Song)',
                    },
                    'startTime': 1555661927247,
                    'endTime': 1555662154866,
                    'submittedAt': 1555661491376,
                    'submitted_by': {
                        '_id': '5cb323d9c403e73a69a5a7b0',
                        'name': 'AngelZatch'
                    }
                }
            ];

            expect(component.buildPartialPlaylist(playlist, 'played')).toEqual(expected);
        });

        it('Can build the list of upcoming videos', () => {
            const expected: Array<QueueVideo> = [
                {
                    '_id': '5cb98fb0b7452c6b3cbfd5c5',
                    'video': {
                        '_id': '5cb447c0770fb93a7020610b',
                        'link': 'UOxkGD8qRB4',
                        'name': 'K/DA - POP/STARS (ft Madison Beer, (G)I-DLE, Jaira Burns) | Official Music Video - League of Legends',
                    },
                    'startTime': null,
                    'endTime': null,
                    'submittedAt': 1555664816009,
                    'submitted_by': {
                        '_id': '5cb323d9c403e73a69a5a7b0',
                        'name': 'AngelZatch'
                    }
                }
            ];

            expect(component.buildPartialPlaylist(playlist, 'upcoming')).toEqual(expected);
        });
    })
});
