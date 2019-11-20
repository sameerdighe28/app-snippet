import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation
} from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { MeetConstants } from '../../meet/meet.constants';
import { DataTableConstants } from './data-table.constants';
import * as R from 'ramda';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {
  @Input() public frontEndPaging: boolean = false;
  @Input() public rowIdProp: string = 'id';

  @Input()
  set columns(columns: any[]) {
    this._columns = columns;
    const firstColumn = columns ? columns[0] : {};
    if (R.isEmpty(this.currentSort)) {
      this.currentSort = {
        prop: firstColumn.prop,
        order: 'asc',
      };
    }
  }

  get columns() {
    return this._columns;
  }

  @Input() public detailColumns: any[];
  @Input() public totalElements: number;
  @Input() public numberOfPages: number;
  @Input() public allCustomerIds: any[];
  @Input() public pageSize: number = DataTableConstants.defaultPageSize;
  @Input() public pageSizeOptions: number[];
  @Input() public sort: Object;
  @Input() public currentPage: number;
  @Input() public currentSort: Object = {};
  @Input() public isLoading: boolean;
  @Input() public noResultsMessage: string;
  @Input() public detailProp: string;
  @Input() public isDetailView: boolean = false;
  @Input() public isMobile: boolean = false;
  @Input() public disableSelect: boolean = false;
  @Input() public canSelectAll: boolean = true;
  @Input() public actionableErrorText: string;
  @Input() public mobileDeleteEnabled: boolean = false;
  @Input() public useMembershipAsIcon: boolean = false;
  @Input() public disableIndividualRowAttribute: string = '';

  @Input()
  set rows(rows: any[]) {
    if (rows && rows.length > 0) {
      this._rows = this.setRows(rows);
      if (this.frontEndPaging) {
        this.allCustomerIds = R.pluck(this.rowIdProp,
          this.rows.filter((row) => !row[this.disableIndividualRowAttribute]));
        this.currentPage = 0;
        this.allRows = this.sortData(this.currentSort, this._rows);
        this.sliceRowsBasedOnCurrentPage();
      }
    } else {
      this._rows = [];
    }
  }
  get rows() { return this._rows; }

  @Input()
  set view(view: any) {
    // TODO: move this logic to the reducer
    if (view === MeetConstants.inactivesView || this.previousView === MeetConstants.inactivesView) {
      this.clearSelections();
    }
    this.previousView = view;
  }
  @Input()
  set initiallySelectedCustomers(initialCustomers: any[]) {
    this.selectedItems = R.clone(initialCustomers);
    this.rows = this.setRows(this.rows);
  }

  @Output() public onPageChange = new EventEmitter<number>();
  @Output() public onPageSizeChange = new EventEmitter<number>();
  @Output() public onSortChange = new EventEmitter<Object>();
  @Output() public onRowClick = new EventEmitter<Object>();
  @Output() public onSelection = new EventEmitter<any[]>();
  @Output() public errorTextClick = new EventEmitter<any>();
  @Output() public onButtonClick = new EventEmitter<any>();
  @Output() public onExternalLinkClick = new EventEmitter<any>();
  @Output() public onDeleteClick = new EventEmitter<any>();

  public selectedItems: any[] = [];
  private _rows: any[];
  private _columns: any[];
  private previousView;
  private allRows: any[];

  constructor(private us: UserService) {
    this.us.selectedLocation$.subscribe(() => {
      this.clearSelections();
    });
  }

  get showCheckboxes(): boolean {
    return !this.disableSelect && this.onSelection.observers.length > 0;
  }

  get showFooter(): boolean {
    return this.onPageChange.observers.length > 0 ||
           this.onPageSizeChange.observers.length > 0 ||
           this.frontEndPaging;
  }

  public onSelectAllOnPage(val: boolean) {
    this.selectAllRowsOnPage(val);
  }

  public onSelectAllCustomers(val: boolean) {
    this.selectAllCustomers(val);
  }

  public rowSelected(rowData: any) {
    this.addOrRemoveSelection(rowData);
    this.onSelection.emit(this.selectedItems);
  }

  public rowClicked(rowData: any) {
    this.onRowClick.emit(rowData);
  }

  public sortChange(event) {
    if (this.onSortChange.observers.length > 0) {
      this.onSortChange.emit(event);
    } else {
      this.allRows = this.sortData(event, this.allRows);
      this.sliceRowsBasedOnCurrentPage();
    }
  }

  public pageChange(event) {
    this.currentPage = event;
    if (this.frontEndPaging) {
      this.sliceRowsBasedOnCurrentPage();
    } else {
      this.onPageChange.emit(event);
    }
  }

  public pageSizeChange(event) {
    this.onPageSizeChange.emit(event);
  }

  public errorTextClicked() {
    this.errorTextClick.emit();
  }

  private sortData(sort, data) {
    let sortedRows = [];
    if (data) {
      const isString = R.propIs(String, sort.prop);
      const ignoreCase = R.compose(R.toLower, R.prop(sort.prop));
      const sortFn = R.sortBy(R.ifElse(
        isString,
        ignoreCase,
        R.prop(sort.prop)
      ));

      sortedRows = sortFn(data);
      if (sort.order === 'desc') {
        sortedRows = R.reverse(sortedRows);
      }
    }
    return sortedRows;
  }

  private sliceRowsBasedOnCurrentPage() {
    const nextRowIndex = this.currentPage * this.pageSize;
    if (nextRowIndex + this.pageSize < this.totalElements) {
      this._rows = this.allRows.slice(nextRowIndex, nextRowIndex + this.pageSize);
    } else {
      this._rows = this.allRows.slice(nextRowIndex, this.totalElements);
    }
    this._rows = this.setRows(this._rows);
  }

  // TODO move this to a util function
  private addOrRemoveSelection(row) {
    let findIndex = this.selectedItems
      .findIndex((val) => val === row[this.rowIdProp]);

    if (findIndex > -1) {
      this.selectedItems.splice(findIndex, 1);
    } else {
      this.selectedItems.push(row[this.rowIdProp]);
    }
    this._rows = [...this._rows];
    this.selectedItems = [...this.selectedItems];
  }

  private clearSelections() {
    this.selectedItems = [];
    this.onSelection.emit(this.selectedItems);
  }

  private setRows(rows) {
    let ids = this.selectedItems;
    return rows.reduce((curr, next) => {
      next = { ...next };
      if (ids.indexOf(next[this.rowIdProp]) > -1) {
        next = { ...next, state: true };
      }
      curr.push(next);
      return curr;
    }, []);
  }

  private selectAllRowsOnPage(isChecked) {
    let findIndex;
    this._rows = this._rows.map((row) => {
      if (isChecked) {
        if (row.state !== isChecked && !row[this.disableIndividualRowAttribute]) {
          this.selectedItems.push(row[this.rowIdProp]);
          row = { ...row, state: isChecked };
        }
      } else {
        findIndex = this.selectedItems
          .findIndex((val) => val === row[this.rowIdProp]);
        this.selectedItems.splice(findIndex, 1);
        row = { ...row, state: isChecked };
      }
      return row;
    });
    this.selectedItems = R.uniq(this.selectedItems);
    this.onSelection.emit(this.selectedItems);
  }

  private selectAllCustomers(isChecked) {
    this._rows = this._rows.map((row) => {
      let mapRow = { ...row };
      if (!row[this.disableIndividualRowAttribute]) {
        mapRow =  { ...row, state: isChecked };
      }
      return mapRow;
    });

    if (isChecked) {
      this.selectedItems = R.uniq(R.concat(this.selectedItems, this.allCustomerIds));
      this.onSelection.emit(this.selectedItems);
    } else {
      this.clearSelections();
    }
  }

  private deleteClicked(row) {
    this.onDeleteClick.emit(row);
  }

  private buttonClicked(rowObj) {
    this.onButtonClick.emit(rowObj);
  }

  private externalLinkClicked(row) {
    this.onExternalLinkClick.emit(row);
  }
}
