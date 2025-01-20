import { Component } from '@angular/core';
import { ProductDto, Sort } from '../../services/models';
import { TableLazyLoadEvent, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ContextService } from '../../services/context/context.service';
import { OrderService } from '../../services/services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  products: ProductDto[] = []
  loading: boolean = true
  totalRecords!: number;
  expandedRows: { [s: string]: boolean } = {};
  globalSearch: string = ''
  sorts!: Array<Sort>;
  sortState!: { [key: string]: string };
  page: number = 1;
  size: number = 50;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private contextService: ContextService
  ) {
    this.setDefoultSorts()
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
      
      
    loadProductsLazy(event: TableLazyLoadEvent){
      this.loading = true;
      this.page = Math.floor(event.first! / event.rows!);
      this.size = event.rows!;
      this.loadProducts()
    }
  
    loadProducts(){
  
    }
        
    setDefoultSorts(){
      const sort: Sort = {
        direction: 'DESC',
        field: 'name'
      }

      this.sorts = [sort]
      this.sortState = {
        'createdDate': 'DESC'
      }
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
    }
    else{
      this.setDefoultSorts()
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
}
