import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

type PipeDataTable = {
    [key: string]: (value: any) => string;
};

@Pipe({
    name: 'dataTable',
})
export class DataTablePipe implements PipeTransform {
    private pipeDataTable: PipeDataTable = {
        text: (value: any = '---') => (value === '' ? '---' : value),

        movil: (value: any = '---') =>
            value.length === 10 ? this.convertMobil(value) : value,

        number: (value: any) =>
            value
                ? `$ ${new Intl.NumberFormat('de-DE', {
                      style: 'decimal',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                  }).format(Math.trunc(value))}`
                : '$ 0',

        document: (value: any) =>
            value
                ? `${new Intl.NumberFormat('de-DE', {
                      style: 'decimal',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                  }).format(Math.trunc(value))}`
                : '0',

        phoneNumber: (value: string): string => {
            if (!value) {
                return '---';
            }

            if (value.length === 10) {
                const match = value.match(/^(\d{3})(\d{3})(\d{0,4})$/);
                return `(${match[1]}) ${match[2]} ${match[3]}`;
            } else {
                const match = value.match(/^(\d{3})(\d{0,6})$/);
                return `${match[1]} ${match[2]}`;
            }
        },

        percentage: (value: any = '---') => `${value}%`,

        date: (value: any) => (value ? this.convertDateAlert(value) : '---'),

        fullDate: (value: any) => (value ? this.convertFullDate(value) : '---'),

        titleCase: (value: any = '---') => {
            if (value) {
                const firstCaracter = (value as string)
                    ?.charAt(0)
                    ?.toUpperCase();
                const word = (value as string)?.substring(1)?.toLowerCase();
                return `${firstCaracter}${word}`;
            }
        },

        upperCase: (value: any = '---') => {
            if (value) {
                const valueString = (value as string)?.toUpperCase();
                return `${valueString}`;
            }
        },
    };

    public convertMobil(value: string): string {
        const part1 = value?.slice(0, 3);
        const part2 = value?.slice(3, 6);
        const part3 = value?.slice(6, 8);
        const part4 = value?.slice(8, 10);

        return `(${part1}) ${part2} ${part3} ${part4}`;
    }

    public convertDateAlert(date: Date | string): string {
        return moment(date).format('DD/MM/YYYY');
    }

    public convertFullDate(date: Date | string): string {
        return moment(date).format('MM/DD/YYYY hh:mm A');
    }

    constructor() {}

    transform(value: unknown, args: string): unknown {
        return this.pipeDataTable[args](value);
    }
}
