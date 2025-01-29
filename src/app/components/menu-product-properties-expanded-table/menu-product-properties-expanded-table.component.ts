import { Component, Input } from '@angular/core';
import { ProductPropertiesDto } from '../../services/models';
import { TableRowExpandEvent, TableRowCollapseEvent } from 'primeng/table';

@Component({
  selector: 'app-menu-product-properties-expanded-table',
  templateUrl: './menu-product-properties-expanded-table.component.html',
  styleUrl: './menu-product-properties-expanded-table.component.scss',
})
export class MenuProductPropertiesExpandedTableComponent {
  @Input({ required: true })
  productPropertiesList: ProductPropertiesDto[] = [];
  expandedRows: { [s: string]: boolean } = {};

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
    this.productPropertiesList.forEach(
      (productProperties) => (this.expandedRows[productProperties.id!] = true)
    );
  }

  collapseAll() {
    this.expandedRows = {};
  }
}
