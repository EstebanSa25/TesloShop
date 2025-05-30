import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnChanges,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles: `
  .swiper{
    width: 100%;
    height: 500px;
  }
  `,
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'].firstChange) return;
    if (!this.swiper) return;
    const paginationElement: HTMLDivElement =
      this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');
    paginationElement.innerHTML = '';
    this.swiper.destroy(true, true);
    setTimeout(() => {
      this.swiperInit();
    }, 100); // Wait for the DOM to update
  }
  ngAfterViewInit(): void {
    this.swiperInit();
  }
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  swiper: Swiper | undefined = undefined;
  swiperInit() {
    const element = this.swiperDiv().nativeElement;
    if (!element) return;
    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      modules: [Navigation, Pagination],
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
