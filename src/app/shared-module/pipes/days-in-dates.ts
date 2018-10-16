import {Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
    name: 'daysInDate'
  })

@Injectable()
export class DaysInDates implements PipeTransform {

    transform(startDate: string, endDate: string) {
        const startDateToDate: any = new Date(startDate);
        const endDateToDate: any = new Date(endDate);
        console.log(`start date is ${startDateToDate}, end date is ${endDateToDate}`);
        const differenceInDate = (endDateToDate - startDateToDate) / 1000 / 60 / 60 / 24;
        const numberInDays = Math.round(differenceInDate);
        console.log(numberInDays);
        return numberInDays;
    }
}
