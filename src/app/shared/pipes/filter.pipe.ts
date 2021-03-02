import { Pipe, PipeTransform } from '@angular/core';
/**
 * Filters a list of object by comparing a value to some of the fields of each object
 *
 * @export
 * @class FilterPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    /**
     * Filters the list of items by the filter criteria on some of the fields of the items as specified by
     * filterFields
     *
     * @param items The items to filter on
     * @param filter The filter value
     * @param filterFields The fields of items to compare against
     * @returns An array of the valid items.
     * @memberof FilterPipe
     */
    transform(items: Array<any>, filter: string, filterFields: Array<string>): Array<any> {
        if (!filter || !Array.isArray(items)) {
            return items
        }

        filter = filter.toLocaleLowerCase()

        return items.filter(item => filterFields.some(key => this.getProp(item, key).toLocaleLowerCase().indexOf(filter) !== -1))
    }

    getProp = (object, property) => property.split('.').reduce((r, e) => r[e], object)
}
