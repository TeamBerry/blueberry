import { Component, OnInit, Input } from '@angular/core';

export interface ChipOptions {
    chipText?: string
    tooltipText?: string
    type: 'random' | 'loop' | 'coin-enabled' | 'lock' | 'duration-limit'
    icon?: string
}

@Component({
    selector: 'app-bx-chip',
    templateUrl: './bx-chip.component.html',
    styleUrls: ['./bx-chip.component.scss']
})
export class BxChipComponent implements OnInit {
    @Input() options: ChipOptions
    @Input() display: 'full' | 'icon' = 'full'

    availableCombinations: Array<ChipOptions> = [
        {
            type: 'random',
            chipText: 'Random',
            tooltipText: 'The next video will be picked at random from the upcoming pool.',
            icon: 'random',
        },
        {
            type: 'loop',
            chipText: 'Loop',
            tooltipText: 'The system will automatically requeue old videos.',
            icon: 'replay',
        },
        {
            type: 'coin-enabled',
            chipText: 'Berries Enabled',
            tooltipText: 'You will collect Berry Coins in this box.',
            icon: 'coin-enabled',
        },
        {
            type: 'lock',
            chipText: 'Private',
            tooltipText: 'Can only be accessed by directly sharing the box link',
            icon: 'lock',
        },
        {
            type: 'duration-limit',
            chipText: 'Video Duration Restriction',
            tooltipText: 'Longer videos will be rejected.',
            icon: 'duration-limit'
        }
    ]

    computedConfiguration: ChipOptions = {
        type: null,
        chipText: null,
        tooltipText: null,
    }

    constructor() { }

    ngOnInit() {
        if (!this.display) {
            this.display = 'full'
        }
        this.computedConfiguration.type = this.options.type

        const matchingDefaultConfiguration = this.availableCombinations.find(configuration => configuration.type === this.options.type)

        this.computedConfiguration.chipText = this.options.chipText ?? matchingDefaultConfiguration.chipText
        this.computedConfiguration.tooltipText = this.options.tooltipText ?? matchingDefaultConfiguration.tooltipText
        this.computedConfiguration.icon = matchingDefaultConfiguration.icon
    }

}
