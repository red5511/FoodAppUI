import { Component } from '@angular/core';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ContextService } from '../../services/context/context.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProductCategoryService } from '../../services/services';
import {
  ChangeProductCategoriesSortOrderRequest,
  DeleteProductCategoryRequest,
  ProductCategoryDto,
} from '../../services/models';
import { Message } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { ImageService } from '../../services/images/Image-service';
import { ModifyProductCategory$Params } from '../../services/fn/product-category/modify-product-category';
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
  addNewCategoryButtonVisible: boolean = true;
  messages: Message[] = [];
  clonedCategory: { [s: number]: ProductCategoryDto } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private contextService: ContextService,
    private productCategoryService: ProductCategoryService,
    private toastService: ToastrService,
    public imageService: ImageService
  ) {}

  ngOnInit() {
    this.messages = [
      {
        severity: 'info',
        detail:
          'Kategorie bedą prezentowane w tej kolejności w panelu tworzenia nowego zamówienia, aby zmienić kolejność przeciagnij wybraną kategorie',
      },
    ];
    this.contextService
      .getCompanyIdObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadCategories();
        },
      });
    this.cols = [{ field: 'name', header: 'Nazwa' }];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  onRowReorder() {
    const body: ChangeProductCategoriesSortOrderRequest = {
      categories: this.categories,
    };
    this.productCategoryService
      .changeProductCategoriesSortOrder({
        body,
        companyId: this.contextService.getCompanyId() ?? -999,
      })
      .subscribe({
        next: () => {
          this.toastService.success('Kolejność kategorii została zmieniona');
        },
      });
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

  onCategoryOption() {}

  onRowEditInit(category: ProductCategoryDto) {
    this.clonedCategory[category.id!] = { ...category };
  }

  onRowEditSave(category: ProductCategoryDto) {
    if (category.name) {
      delete this.clonedCategory[category.id!];
      const params: ModifyProductCategory$Params = {
        body: {
          modifiedId: category.id,
          category,
        },
      };
      this.productCategoryService.modifyProductCategory(params).subscribe({
        next: () => {
          this.toastService.success('Modyfikacja przebiegła poprawnie');
        },
      });
    }
  }

  onRowEditCancel(category: ProductCategoryDto, index: number) {
    this.categories[index] = this.clonedCategory[category.id!];
    delete this.clonedCategory[category.id!];
  }

  onDeleteCategory(category: ProductCategoryDto) {
    var body: DeleteProductCategoryRequest = {
      companyId: category.companyId,
      productCategoryId: category.id,
    };
    this.productCategoryService.deleteProductCategory({ body }).subscribe({
      next: () => {
        this.toastService.success('Usunięcie przebiegło poprawnie');
        this.categories = this.categories.filter((el) => el.id !== category.id);
      },
    });
  }

  onDeleteCategoryWithProducts(category: ProductCategoryDto) {
    var body: DeleteProductCategoryRequest = {
      companyId: category.companyId,
      productCategoryId: category.id,
    };
    this.productCategoryService.deleteProductCategoryWithProducts({ body }).subscribe({
      next: () => {
        this.toastService.success('Usunięcie przebiegło poprawnie');
        this.categories = this.categories.filter((el) => el.id !== category.id);
      },
    });
  }
}
