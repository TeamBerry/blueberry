import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-box-status-indicator',
  templateUrl: './box-status-indicator.component.html',
  styleUrls: ['./box-status-indicator.component.scss']
})
export class BoxStatusIndicatorComponent implements OnInit {
    @Input() isOpen: boolean

  constructor() { }

  ngOnInit() {
  }

}
