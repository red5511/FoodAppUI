import { Component } from '@angular/core';
import {
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
import { debounceTime, Subject, switchMap, takeUntil } from 'rxjs';
import { ContextService } from '../../services/context/context.service';
import { OrderService, ProductService } from '../../services/services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  products: ProductDto[] = [];
  productCategories: ProductCategoryDto[] = [];
  productPropertiesList: ProductPropertiesDto[] = [];
  loading: boolean = true;
  totalRecords!: number;
  expandedRows: { [s: string]: boolean } = {};
  globalSearch: string = '';
  sorts!: Array<Sort>;
  sortState!: { [key: string]: string };
  page: number = 1;
  size: number = 50;
  addNewProductDialogVisibility: boolean = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private contextService: ContextService
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
      direction: 'DESC',
      field: 'name',
    };

    this.sorts = [sort];
    this.sortState = {
      name: 'DESC',
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

  onAddNewProductClick() {
    console.log('onAddNewProductClick');
    console.log(this.addNewProductDialogVisibility);
    this.addNewProductDialogVisibility = true;
  }

  dialogVisibleChange(event: boolean) {
    this.addNewProductDialogVisibility = event;
    this.loadProducts();
  }
}
