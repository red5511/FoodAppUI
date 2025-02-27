import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input()
  selectedProductProperties: ProductPropertiesDto[] = [];
  @Output()
  onChangeCheckedBoxes: EventEmitter<ProductPropertiesDto[]> = new EventEmitter<ProductPropertiesDto[]>();
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

  selectionChange(event: ProductPropertiesDto[]){
    if(event !== undefined){
      this.onChangeCheckedBoxes.emit(event)
    }
      
  }
}
