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

        const [_, hours, mins, secs] = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

        if (hours) { duration += `${hours}h` }
        if (mins) { duration += `${mins}min` }
        if (secs) { duration += `${secs}s` }

        return duration
    }
}
