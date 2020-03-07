import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'priceFormat' })
export class PriceFormatPipe implements PipeTransform {
    transform(value: number | string): string {
        if (typeof value === 'string') {
            return value
        }

        if (!value) {
            return '0'
        }
        let arr = value.toString().split('.');
        if (arr.length === 2) {
            return arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + arr[1];
        }
        return arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}
