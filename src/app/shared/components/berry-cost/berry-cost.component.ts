import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-berry-cost',
  templateUrl: './berry-cost.component.html',
  styleUrls: ['./berry-cost.component.scss']
})
export class BerryCostComponent {
    @Input() value: number;
}
