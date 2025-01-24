import { Component, Input } from '@angular/core';
import { ProductPropertiesDto } from '../../services/models';
import { TableRowExpandEvent, TableRowCollapseEvent } from 'primeng/table';

@Component({
  selector: 'app-new-product-properties-list',
  templateUrl: './new-product-properties-list.component.html',
  styleUrl: './new-product-properties-list.component.scss',
})
export class NewProductPropertiesListComponent {
  @Input({ required: true })
  productPropertiesList!: ProductPropertiesDto[];
  selectedProductProperties!: ProductPropertiesDto;
  expandedRows: { [s: string]: boolean } = {};

  onRowExpand(event: TableRowExpandEvent) {
    const productProps = event.data;
    this.collapseAll();
    this.expandedRows[productProps.id] = true;
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    const productProps = event.data;
    delete this.expandedRows[productProps.id];
  }

  collapseAll() {
    this.expandedRows = {};
  }
}
