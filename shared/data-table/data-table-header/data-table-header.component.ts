import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import * as R from 'ramda';

@Component({
  selector: 'data-table-header',
  templateUrl: './data-table-header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('arrowState', [
      state('desc', style({
        transform: 'rotate(-180deg)',
        opacity: 1.0
      })),
      state('asc', style({
        transform: 'rotate(0deg)',
        opacity: 1.0
      })),
      state('none', style({
        opacity: 0.0
      })),
      transition('desc => asc', animate('150ms ease-in-out')),
      transition('asc => desc', animate('150ms ease-in-out')),
      transition('none => asc', animate('150ms ease-in-out')),
      transition('asc => none', animate('150ms ease-in-out')),
      transition('desc => none', animate('150ms ease-in-out'))
    ])
  ],
})
export class DataTableHeaderComponent {
  @Input() public columns: any[];
  @Input() public currentSort: Object;
  @Input() public isLoading: boolean;
  @Input() public showCheckboxes: boolean;
  @Input() public showSort: boolean;
  @Input() public selectedItems: any[];
  @Input() public allCustomerIds: any[];
  @Input() public rowIdProp: string;
  @Input() public canSelectAll: boolean;
  @Input() public disableIndividualRowAttribute: string;
  @Input()
  set rows(rows: any[]) {
    if (rows) {
      let filterDisabled = (row) => !row[this.disableIndividualRowAttribute];
      this.uniqueRowsOnPage = R.filter(filterDisabled)(rows);
      this.uniqueRowsOnPage = R.uniq(R.pluck(this.rowIdProp)(this.uniqueRowsOnPage));
      this._rows = rows;
    } else {
      this.uniqueRowsOnPage = [];
      this._rows = [];
    }
  }
  get rows() { return this._rows; }

  @Output() public onSortChange = new EventEmitter<Object>();
  @Output() public onSelectAllOnPage = new EventEmitter<Object>();
  @Output() public onSelectAllCustomers = new EventEmitter<Object>();

  private uniqueRowsOnPage: any[];
  private _rows: any[];

  public changeSort(col) {
    if (this.colIsNotSortable(col)) {
      return;
    } else if (this.colIsAlreadySelected(col)) {
      // reverse sorting
      let currOrd = this.currentSort['order'];
      let order = currOrd === 'asc' ? 'desc' : 'asc';
      this.currentSort = Object.assign({}, this.currentSort, { order });
    } else {
      let prop = col.prop;
      let order = 'asc';
      this.currentSort = Object.assign({}, this.currentSort, { prop, order });
    }
    this.onSortChange.emit(this.currentSort);
  }

  public isAllOnPageSelected() {
    if (this.rows !== undefined && this.rows.length > 0) {
      return this.rows.every((row) => (row['state'] || row[this.disableIndividualRowAttribute]));
    }
  }

  public isAllCustomersSelected() {
    return this.allCustomerIds.every((elem) => this.selectedItems.indexOf(elem) > -1);
  }

  public selectAllClicked(state) {
    if (this.isAllCustomersSelected()) {
      this.onSelectAllCustomers.emit(state.checked);
    } else {
      this.onSelectAllOnPage.emit(state.checked);
    }
  }

  public selectAllCustomers(state) {
    this.onSelectAllCustomers.emit(state);
  }

  public getColState(col) {
    if (this.currentSort['prop'] && this.currentSort['order']
        && this.currentSort['prop'] === col.prop) {
      return this.currentSort['order'];
    } else {
      return 'none';
    }
  }

  public getFlex() {
    return this.showCheckboxes ? '55px' : '25px';
  }

  private colIsNotSortable(col) {
    return col.hasOwnProperty('sort') && col.sort === false;
  }

  private colIsAlreadySelected(col) {
    return this.currentSort['prop'] && this.currentSort['prop'] === col.prop;
  }
}
