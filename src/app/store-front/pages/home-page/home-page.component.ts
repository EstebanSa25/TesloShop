import { Component, inject, signal } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Product } from '@products/interfaces/product.interface';
@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  service = inject(ProductsService);
  productsResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.service.getProducts({
        limit: 9,
      });
    },
  });
}
