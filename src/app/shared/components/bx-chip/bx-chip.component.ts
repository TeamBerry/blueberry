import { Component, OnInit, Input } from '@angular/core';

export interface ChipOptions {
    chipText?: string
    tooltipText?: string
    type: 'random' | 'loop' | 'no-coin'
    icon?: string
}

@Component({
  selector: 'app-bx-chip',
  templateUrl: './bx-chip.component.html',
  styleUrls: ['./bx-chip.component.scss']
})
export class BxChipComponent implements OnInit {
    @Input() options: ChipOptions

    availableCombinations: Array<ChipOptions> = [
        {
            type: 'random',
            chipText: 'Random',
            tooltipText: 'The next video will be picked at random from the upcoming pool.',
            icon: 'random'
        },
        {
            type: 'loop',
            chipText: 'Loop',
            tooltipText: 'The system will automatically requeue old videos.',
            icon: 'replay'
        },
        {
            type: 'no-coin',
            chipText: 'No Berries',
            tooltipText: 'You will not collect Berry Coins in this box.',
            icon: 'no-coin'
        }
    ]

    computedConfiguration: ChipOptions = {
        type: null,
        chipText: null,
        tooltipText: null
    }

    constructor() { }

    ngOnInit() {
        this.computedConfiguration.type = this.options.type

        const matchingDefaultConfiguration = this.availableCombinations.find(configuration => configuration.type === this.options.type)

        this.computedConfiguration.chipText = this.options.chipText ?? matchingDefaultConfiguration.chipText
        this.computedConfiguration.tooltipText = this.options.tooltipText ?? matchingDefaultConfiguration.tooltipText
        this.computedConfiguration.icon = matchingDefaultConfiguration.icon
    }

}
