import { Component } from '@angular/core';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ContextService } from '../../services/context/context.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProductCategoryService } from '../../services/services';
import {
  ChangeProductCategoriesSortOrderRequest,
  ProductCategoryDto,
} from '../../services/models';
interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-menu-category',
  templateUrl: './menu-category.component.html',
  styleUrl: './menu-category.component.scss',
})
export class MenuCategoryComponent {
  categoryForm: any;
  categories: ProductCategoryDto[] = [];
  cols!: Column[];
  expandedRows: { [s: string]: boolean } = {};
  loading: boolean = true;
  addNewCategoryButtonVisible: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(
    private contextService: ContextService,
    private productCategoryService: ProductCategoryService
  ) {}

  ngOnInit() {
    this.contextService
      .getCompanyIdObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = true;
          this.loadCategories();
        },
      });
    this.cols = [{ field: 'name', header: 'Nazwa' }];
  }

  loadCategories() {
    this.productCategoryService
      .getAllCategories({
        companyId: this.contextService.getCompanyId() ?? -999,
      })
      .subscribe({
        next: (response) => {
          if (response.categories) {
            this.categories = response.categories;
          }
        },
      });
  }

  onColumnReorder() {
    const body: ChangeProductCategoriesSortOrderRequest = {
      categories: this.categories,
    };
    this.productCategoryService
      .changeProductCategoriesSortOrder({
        body,
        companyId: this.contextService.getCompanyId() ?? -999,
      })
      .subscribe();
  }

  onAddNewCategoryButtonClick() {
    this.addNewCategoryButtonVisible = false;
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
    this.categories.forEach(
      (category) => (this.expandedRows[category.id!] = true)
    );
  }

  collapseAll() {
    this.expandedRows = {};
  }
}
