import { Component } from '@angular/core';
import { ProductDto, ProductsByCategoryTabView } from '../../services/models';
import { ProductService } from '../../services/services';
import { ContextService } from '../../services/context/context.service';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart/cart-service';

@Component({
  selector: 'app-restaurant-order',
  templateUrl: './restaurant-order.component.html',
  styleUrl: './restaurant-order.component.scss'
})
export class RestaurantOrderComponent {
  activeIndex: number = 0;
  productTabs: ProductsByCategoryTabView[] = []
  destroy$ = new Subject<void>();

  constructor(private productService: ProductService,
    private contextService: ContextService,
    private cartService: CartService
  ){}

  ngOnInit(){
        this.contextService
          .getCompanyIdObservable()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.getProductTabs()
            }
          })
          
  }

  getProductTabs(){
    this.productService.getProductsByCategories({companyId : this.contextService.getCompanyId() ?? -999}).subscribe(
      {
        next: (response) => {
          if(response.menuOrderingTabs){
            this.productTabs = response.menuOrderingTabs;
          }
        }
      }
    )
  }
}
