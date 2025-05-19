import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): string {
    if (typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`;
    }

    return value.length > 0
      ? `${baseUrl}/files/product/${value.at(0)}`
      : `./assets/images/no-image.jpg`;
  }
}
