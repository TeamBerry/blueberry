import { Pipe, PipeTransform } from '@angular/core';

/**
 * Evaluates the deletion date of a box, based on its last update date and a given grace period.
 *
 * The grace period is 7 days by default, though it can be overridden.
 *
 * @export
 * @class BoxDeletionEstimationPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'boxDeletionEstimationPipe'
})
export class BoxDeletionEstimationPipe implements PipeTransform {
    transform(date: Date, daysToAdd: number = 7) {
        return new Date().setDate(new Date(date).getDate() + daysToAdd);
    }
}
