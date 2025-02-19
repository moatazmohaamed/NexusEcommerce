import { ProductsService } from './../../core/services/products/products.service';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { model, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  imports: [GalleriaModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  isLoading: boolean = false;
  productPhotos!: any[];
  productData: any = '';
  productID: any = '';
  lazyComponent: any = '';
  cartMsg: string = '';
  isBrowser: any = '';
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productService = inject(ProductsService);
  readonly cartService = inject(CartService);
  private readonly platId = inject(PLATFORM_ID);
  private readonly toastr = inject(ToastrService);

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        this.productID = res.get('id');
        this.productService.getSpecificProducts(this.productID).subscribe({
          next: (res) => {
            this.productPhotos = res.data.images;
            this.productData = res.data;
          },
        });
      },
    });
  }
  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4,
    },
    {
      breakpoint: '575px',
      numVisible: 4,
    },
  ];

  addToCart(pId: string): void {
    this.cartService.addProductCart(pId).subscribe({
      next: (res) => {
        this.toastr.success(res.message, 'Success', {
          progressBar: true,
        });
        this.cartService.totalCartItems.next(res.numOfCartItems);
      },
    });
  }
}
