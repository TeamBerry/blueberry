import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export type TabOption = {
    title: string,
    value?: string
}

@Component({
  selector: 'app-bx-tabset',
  templateUrl: './bx-tabset.component.html',
  styleUrls: ['./bx-tabset.component.scss']
})
export class BxTabsetComponent implements OnInit {
    @Input() options: Array<TabOption>
    @Output() clickedOption: EventEmitter<string> = new EventEmitter<string>();
    activeOption: string

    constructor() { }

    ngOnInit() {
        this.activeOption = this.options[0].value;
    }

    onSelectOption(optionValue: string) {
        this.activeOption = optionValue;
        this.clickedOption.emit(optionValue);
    }

}
