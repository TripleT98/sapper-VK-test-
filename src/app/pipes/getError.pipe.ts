import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Pipe({
  name: 'getError'
})
export class GetErrorPipe implements PipeTransform{
  errors = {
    min: function({min,actual}:{min:number, actual: number}){
      return `Минимальная величина ${min}. ${actual} меньше ${min}`
    },
    max: function({max,actual}:{max:number, actual: number}){
      return `Максимальная величина ${max}. ${actual} больше ${max}`
    },
  } as any;
  transform(val: any, form: FormControl){
    if(form.errors){
      const error = Object.keys(form.errors as Object)[0];
      return this.errors[error]?.(form.errors[error]);
    }
    return '';
  }
}
