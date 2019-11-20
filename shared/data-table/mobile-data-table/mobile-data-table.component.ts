import {
  Component, Input, ViewEncapsulation, ChangeDetectionStrategy,
  Output, EventEmitter
} from '@angular/core';
import { find, propEq } from 'ramda';

@Component({
  selector: 'mobile-data-table',
  templateUrl: './mobile-data-table.component.html',
  styleUrls: ['./mobile-data-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileDataTableComponent {
  @Input() public rows: any[];
  @Input() public noResultsMessage: string;
  @Input() public numberOfPages: number;
  @Input() public currentPage: number;
  @Input() public totalElements: number;
  @Input() public pageSizeOptions: number[];
  @Input() public pageSize: number;
  @Input() public showFooter: boolean = true;
  @Input() public loading: boolean;
  @Input() public actionableErrorText: string;
  @Input() public mobileDeleteEnabled: boolean = false;
  @Input() public useMembershipAsIcon: boolean = false;
  @Input()
  set columns(columns: any[]) {
    if (columns) {
      this.mobileColumns = columns.filter((col) => {
        return col.mobile;
      });

      if (this.useMembershipAsIcon) {
        let membershipColumn = find(propEq('prop', 'memberStatus'))(columns);
        this.displayCfaOne = membershipColumn.displayCfaOne;
      }
    }
  }

  @Output() public onRowClick = new EventEmitter<Object>();
  @Output() public onErrorTextClick = new EventEmitter<Object>();
  @Output() public onPageChange = new EventEmitter<Object>();
  @Output() public onDeleteClick = new EventEmitter<Object>();

  private mobileColumns: any[];
  private displayCfaOne: boolean;

  public rowClicked(rowData: any) {
    this.onRowClick.emit(rowData);
  }

  public isDataAvailable() {
    return this.rows
      && this.rows.length
      && this.rows.length > 0;
  }

  public changeCurrentPage(page) {
    this.onPageChange.emit(page);
  }

  public getMembership(row) {
    return row['memberStatus'] ? row['memberStatus'] : '';
  }

  public displayDivider(row) {
    if (this.pageSize < this.totalElements) {
      return this.rows.indexOf(row) !== this.pageSize - 1;
    } else {
      return this.rows.indexOf(row) !== this.totalElements - 1;
    }
  }

  public deleteClicked(row) {
    this.onDeleteClick.emit(row);
  }
}
