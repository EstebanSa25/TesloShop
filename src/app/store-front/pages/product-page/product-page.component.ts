import { Component, inject, linkedSignal, OnInit } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { of } from 'rxjs';
import { ProductCarouselComponent } from '../../../products/components/product-carousel/product-carousel.component';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  productService = inject(ProductsService);
  activadedRoute = inject(ActivatedRoute);
  productIdSlug = this.activadedRoute.snapshot.paramMap.get('idSlug');
  productResource = rxResource({
    request: () => ({ idSlug: this.productIdSlug }),
    loader: ({ request }) => {
      console.log({ request });
      return this.productService.getProductBySlug(request.idSlug || '');
    },
  });
}
