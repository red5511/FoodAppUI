import { Component } from '@angular/core';
import {
  DeleteProductRequest,
  GetPagedProductsResponse,
  GetProductsRequest,
  ProductCategoryDto,
  ProductDto,
  ProductPropertiesDto,
  Sort,
} from '../../services/models';
import {
  TableLazyLoadEvent,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ContextService } from '../../services/context/context.service';
import { ProductService } from '../../services/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  products: ProductDto[] = [];
  modifiedProduct: ProductDto | undefined;
  productCategories: ProductCategoryDto[] = [];
  productPropertiesList: ProductPropertiesDto[] = [];
  loading: boolean = true;
  isProductTwoPagePanelVisible: boolean = false;
  totalRecords!: number;
  expandedRows: { [s: string]: boolean } = {};
  globalSearch: string = '';
  sorts!: Array<Sort>;
  sortState!: { [key: string]: string };
  page: number = 1;
  size: number = 50;
  deleteProductDialogVisible: boolean = false;
  selectedProductIdToDelete: number | undefined = undefined;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private contextService: ContextService,
    private toastService: ToastrService
  ) {
    this.setDefoultSorts();
  }

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(400), // Delay of 300ms
        takeUntil(this.destroy$) // Automatically unsubscribes on destroy
      )
      .subscribe((searchTerm) => {
        this.onFilterChange();
      });
  }

  loadProductsLazy(event: TableLazyLoadEvent) {
    this.contextService
      .getCompanyIdObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.page = Math.floor(event.first! / event.rows!);
          this.size = event.rows!;
          this.loading = true;
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error fetching companyId:', error);
        },
      });
  }

  loadProducts() {
    const body: GetProductsRequest = {
      page: this.page,
      size: this.size,
      sorts: this.sorts,
      globalSearch: this.globalSearch,
      companyId: this.contextService.getCompanyId(),
    };

    this.productService.getPagedProducts({ body }).subscribe({
      next: (response: GetPagedProductsResponse) => {
        if (response && response.pagedResult) {
          this.products = response.pagedResult.products ?? [];
          this.totalRecords = response.pagedResult.totalRecords ?? 0;
          this.loading = false; // Set to false once data is loaded
          if (
            this.productCategories.length == 0 ||
            this.productPropertiesList.length === 0
          ) {
            this.productCategories = response.productCategories ?? [];
            this.productPropertiesList = response.productPropertiesList ?? [];
          }
        }
      },
      error: (error) => {
        console.error('Error fetching companyId:', error);
      },
    });
  }

  setDefoultSorts() {
    const sort: Sort = {
      direction: 'ASC',
      field: 'productCategory',
    };

    this.sorts = [sort];
    this.sortState = {
      productCategory: 'ASC',
    };
  }

  onSortChanged({
    field,
    state,
  }: {
    field: string;
    state: 'ASC' | 'DESC' | 'NONE';
  }) {
    if (state !== 'NONE') {
      this.sorts = [
        {
          direction: state,
          field,
        },
      ];
    } else {
      this.setDefoultSorts();
    }
    this.loadProducts();
  }

  onFilterChange() {
    this.loadProducts();
  }

  onInputChange(value: string): void {
    this.searchSubject.next(value); // Pass the input value to the Subject
  }

  onRowExpand(event: TableRowExpandEvent) {
    const product = event.data;
    this.collapseAll();
    this.expandedRows[product.id] = true;
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    const product = event.data;
    delete this.expandedRows[product.id];
  }

  expandAll() {
    this.products.forEach((product) => (this.expandedRows[product.id!] = true));
  }

  collapseAll() {
    this.expandedRows = {};
  }

  dialogVisibleChange(loadProducts: boolean) {
    if (loadProducts) {
      this.loadProducts();
    }
    this.isProductTwoPagePanelVisible = false;
  }

  onDeleteProductButtonClick(productId: number) {
    this.deleteProductDialogVisible = true;
    this.selectedProductIdToDelete = productId;
  }

  onModifyProductButtonClick(product: ProductDto) {
    this.isProductTwoPagePanelVisible = true;
    this.modifiedProduct = product;
  }

  onCancelDeleteProduct() {
    this.deleteProductDialogVisible = false;
  }

  onApproveDeleteProduct() {
    const body: DeleteProductRequest = {
      companyId: this.contextService.getCompanyId() ?? -999,
      productId: this.selectedProductIdToDelete,
    };
    this.productService.deleteProduct({ body }).subscribe({
      next: () => {
        this.toastService.success('Usunięcie produktu przebiegło poprawnie');
        this.loadProducts();
        this.deleteProductDialogVisible = false;
      },
    });
  }

  onAddNewProductClick() {
    this.modifiedProduct = undefined;
    this.isProductTwoPagePanelVisible = true;
  }
}
