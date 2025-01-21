import { Component } from '@angular/core';
import { ProductDto } from '../../services/models';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss',
})
export class NewProductComponent {
  product: ProductDto = {};


  saveProduct(){
    
  }
}
