import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sortable-column',
  templateUrl: './sortable-column-entry.component.html',
  styleUrls: ['./sortable-column-entry.component.scss'],
})
export class SortableColumnEntryComponent {
  @Input() field: string = ''; // Field to sort by (e.g., 'name', 'email')
  @Input() label: string = ''; // Label for the column header
  @Input() sortState: { [key: string]: string } = {}; // Object to manage sorting states
  @Output() sortChanged: EventEmitter<{ field: string; state: 'ASC' | 'DESC' | 'NONE' }> =
    new EventEmitter();

  noNoneField: string = 'createdDate'
  // Cycle the sorting state
  cycleSort() {
    const nextState = this.getNextSortState(this.sortState[this.field], this.field);

    // Update the sort state for this field
    this.sortState[this.field] = nextState;

    // Emit the sort change to parent component
    this.sortChanged.emit({ field: this.field, state: nextState });

    // Reset sorting for other fields
    for (const key in this.sortState) {
      if (key !== this.field) this.sortState[key] = 'NONE';
    }
  }

  // Determine the next sorting state
  getNextSortState(currentState: string, field: string): 'ASC' | 'DESC' | 'NONE' {
    switch (currentState) {
      case 'NONE':
        return 'ASC';
      case 'ASC':
        return 'DESC';
      case 'DESC':
        if(this.noNoneField === field){
          return 'ASC'
        }
        return 'NONE';
      default:
        return 'ASC';
    }
  }

  // Get the correct sort icon class
  getSortIcon(): string {
    switch (this.sortState[this.field]) {
      case 'ASC':
        return 'pi-arrow-up'; // Ascending icon
      case 'DESC':
        return 'pi-arrow-down'; // Descending icon
      case 'NONE':
        return 'pi-sort-alt'; // Unsorted icon
      default:
        return 'pi-sort-alt';
    }
  }
}
