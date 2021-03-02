import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-duration-line',
  templateUrl: './duration-line.component.html',
  styleUrls: ['./duration-line.component.scss']
})
export class DurationLineComponent implements OnChanges {
    @Input() current: number;
    @Input() videoDuration: string;

    displayInterval;
    displayWidth: number;

    constructor() { }

    ngOnChanges(changes: { current: SimpleChange, videoDuration: SimpleChange }) {
        clearInterval(this.displayInterval);

        if (!changes?.current) {
            this.current = 0;
            this.displayWidth = 0;
        }

        if (!changes.videoDuration && !this.videoDuration) {
            return;
        }

        const widthUnit = 100 / this.convertDurationToSeconds(this.videoDuration);

        this.displayInterval = setInterval(() => {
            this.current += 1;
            this.displayWidth = this.current * widthUnit;
        }, 1000);
    }

    convertDurationToSeconds = (value: string) => {
        const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        let hours = 0; let minutes = 0; let seconds = 0; let
          totalseconds;

        if (reptms.test(value)) {
          const matches = reptms.exec(value);
            if (matches[1]) {
                hours = Number(matches[1]);
            }

            if (matches[2]) {
                minutes = Number(matches[2]);
            }

            if (matches[3]) {
                seconds = Number(matches[3]);
            }

          totalseconds = hours * 3600 + minutes * 60 + seconds;
        }

        return totalseconds;
      };
}
