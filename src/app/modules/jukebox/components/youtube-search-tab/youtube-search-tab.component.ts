import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from 'app/shared/services/search.service';
import { Video } from 'app/shared/models/video.model';
import { JukeboxService } from '../../jukebox.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { Permission, VideoSubmissionRequest } from '@teamberry/muscadine';

@Component({
    selector: 'app-youtube-search-tab',
    templateUrl: './youtube-search-tab.component.html',
    styleUrls: ['./youtube-search-tab.component.scss']
})
export class YoutubeSearchTabComponent implements OnInit {
    @Input() boxToken: string;
    @Input() user: AuthSubject;
    @Input() videosInQueue: Array<string>;
    @Input() berriesEnabled: boolean;
    @Input() permissions: Array<Permission> = [];
    searchValue = ''
    errorMessage
    defaultSearchCooldown = 5
    searchTimeoutValue = 5
    searchInterval
    canSearch = true

    searchResults: Array<Video> = []

    constructor(
        private jukeboxService: JukeboxService,
        private searchService: SearchService
    ) { }

    ngOnInit() {
    }

    checkValidity(): boolean {
        this.errorMessage = ''
        // Length of value
        if (this.searchValue.length < 3) {
            this.errorMessage = 'Your search criteria needs to have at least 3 characters.'
            return false
        }
        // Timeout
        if (this.canSearch === false) {
            // tslint:disable-next-line: max-line-length
            this.errorMessage = `You have to wait at least ${this.defaultSearchCooldown} seconds before two requests. Please wait until you can search again.`
            return false
        }
        return true
    }

    searchYouTube() {
        if (this.checkValidity()) {
            // Reset cooldown
            this.canSearch = false
            this.searchTimeoutValue = this.defaultSearchCooldown
            // Search
            this.searchService.searchOnYoutube(this.searchValue).subscribe(
                (videos: Array<Video>) => {
                    this.searchResults = videos;
                    // Cooldown of 5s before allowing a new search
                    this.searchInterval = setInterval(() => {
                        this.searchTimeoutValue--
                        if (this.searchTimeoutValue <= 0) {
                            clearInterval(this.searchInterval)
                            this.canSearch = true
                        }
                    }, 1000);
                },
                (error) => {
                    this.canSearch = true
                    this.errorMessage = 'Your search could not be executed. Please try again later.'
                }
            )
        }
    }

    resetSearch() {
        this.searchValue = ''
    }

    /**
     * Relays the output event from the video-entry component and submits the video
     * to the box, via the jukebox service method "submitVideo"
     *
     * @param {Video} video The video to submit
     * @param {VideoSubmissionRequest['flag']} flag
     * @memberof FavoriteSearchTabComponent
     */
    submitVideo(event: { video: Video, flag?: VideoSubmissionRequest['flag']}) {
        const submissionPayload: VideoSubmissionRequest = {
            link: event.video.link,
            userToken: this.user._id,
            boxToken: this.boxToken,
            flag: event?.flag
        };

        this.jukeboxService.submitVideo(submissionPayload);
    }

}
