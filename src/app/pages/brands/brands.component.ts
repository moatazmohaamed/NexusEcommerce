import { Component, inject } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrands } from '../../shared/interfaces/ibrands';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent {
  private readonly brandsService = inject(BrandsService);
  allBrands: IBrands = {} as IBrands;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getBrands();
  }

  getBrands(): void {
    this.brandsService.getALlBrands().subscribe({
      next: (res) => {
        this.allBrands = res;
        console.log(res);
      },
    });
  }
}
