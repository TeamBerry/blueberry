import { Component, Input, OnInit } from '@angular/core';
import { BerryCount } from '@teamberry/muscadine';
import { filter } from 'rxjs/operators';
import { JukeboxService } from '../../jukebox.service';

@Component({
  selector: 'app-berry-counter',
  templateUrl: './berry-counter.component.html',
  styleUrls: ['./berry-counter.component.scss']
})
export class BerryCounterComponent implements OnInit {
    @Input() boxToken: string;
    count: number;

    constructor(
      private jukeboxService: JukeboxService
  ) { }

    ngOnInit() {
        this.jukeboxService.getBerryCount().subscribe((contents: BerryCount) => this.count = contents.berries)
    }
}
