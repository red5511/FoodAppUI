import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ProductCategoryDto,
  ProductDto,
  ProductPropertiesDto,
} from '../../services/models';

@Component({
  selector: 'app-new-product-two-page-panel',
  templateUrl: './new-product-two-page-panel.component.html',
  styleUrl: './new-product-two-page-panel.component.scss',
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 1 }),
        animate('0.3s ease', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate(
          '0.9s ease',
          style({ transform: 'translateX(-100%)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class NewProductTwoPagePanelComponent {
  @Input({ required: true })
  productCategories!: ProductCategoryDto[];
  @Input({ required: true })
  productPropertiesList!: ProductPropertiesDto[];
  @Input({ required: true })
  isDialogVisible!: boolean;
  @Output()
  isDialogVisibleChange = new EventEmitter<boolean>();
  isNewCategoryButtonVisible: boolean = false;
  newCategoryInput: string = '';
  selectedProductCategory: ProductCategoryDto | undefined;
  product: ProductDto = {};

  onNewCategoryClick() {
    this.isNewCategoryButtonVisible = !this.isNewCategoryButtonVisible;
  }

  currentStep = 1; // Track the current step

  nextStep() {
    this.currentStep = 2;
  }

  previousStep() {
    this.currentStep = 1;
  }

  onHide() {
    this.isDialogVisibleChange.emit(false);
    this.currentStep = 1; // Reset to the first step
    this.isNewCategoryButtonVisible = false; // Hide the new category input
    this.newCategoryInput = ''; // Clear the input field
    this.selectedProductCategory = undefined; // Reset the selected category
    this.product = {}; // Reset the product object
  }
}
