import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a duration into a readable value, e.g. PT3M21S => 03:21
 *
 * @export
 * @class DurationPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'duration'
})
export class DurationPipe implements PipeTransform {
    transform(value: string): string {
        let duration = ''

        const [_, years, days, hours, mins, secs] = value.match(/PT(?:(\d+)Y)?(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

        if (years) {
            duration += `${years}y `
        }

        if (days) {
            duration += `${days}d `
        }

        if (hours) {
            duration += `${hours}h `
        }

        if (mins) {
            duration += `${mins}min `
        }

        if (secs) {
            duration += `${secs}s`
        }

        return duration
    }
}
