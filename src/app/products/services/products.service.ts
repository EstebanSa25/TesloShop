import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;
interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}
const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCacheBySlug = new Map<string, Product>();
  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        },
      })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.productsCache.set(key, resp))
      );
  }
  getProductBySlug(slug: string): Observable<Product> {
    if (this.productCacheBySlug.has(slug)) {
      return of(this.productCacheBySlug.get(slug)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${slug}`).pipe(
      tap((resp) => console.log({ resp })),
      tap((resp) => this.productCacheBySlug.set(slug, resp))
    );
  }
  getProductById(id: string): Observable<Product> {
    if (id === 'new') return of(emptyProduct);
    if (this.productCacheBySlug.has(id)) {
      return of(this.productCacheBySlug.get(id)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      tap((resp) => console.log({ resp })),
      tap((resp) => this.productCacheBySlug.set(id, resp))
    );
  }
  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    return this.updloadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...productLike,
        images: [...(productLike.images ?? []), ...imageNames],
      })),
      switchMap((updatedProduct) =>
        this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
      ),
      tap((resp) => this.updateProductCache(resp))
    );
    // return this.http
    //   .patch<Product>(`${baseUrl}/products/${id}`, productLike)
    //   .pipe(tap((resp) => this.updateProductCache(resp)));
  }
  createProduct(
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    return this.http
      .post<Product>(`${baseUrl}/products`, productLike)
      .pipe(tap((resp) => this.updateProductCache(resp)));
  }
  updateProductCache(product: Product) {
    const productId = product.id;
    this.productCacheBySlug.set(productId, product);
    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) =>
          currentProduct.id === productId ? product : currentProduct
      );
    });
  }
  updloadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);
    const uploadObservables = Array.from(images).map((image) =>
      this.updloadImage(image)
    );
    // forkJoin espera a que todas las observables se completen y devuelve un array con los resultados como un await
    return forkJoin(uploadObservables);
  }
  updloadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);
    return this.http
      .post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }
}
