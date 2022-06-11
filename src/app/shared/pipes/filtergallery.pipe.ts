import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtergallery'
})
export class FiltergalleryPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!args.trim().length) return value;
    return value.filter(v => v.toLowerCase().includes(args.toLowerCase()));
  }

}
