import { Pipe, PipeTransform } from '@angular/core';
import { IProducts } from '../../interfaces/iproducts';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(products: IProducts[], order: 'asc' | 'desc' = 'asc'): IProducts[] {
    return products.sort((a, b) => {
      if (order === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }
}
