import {
  Component, Input, ViewEncapsulation, ChangeDetectionStrategy,
  Output, EventEmitter
} from '@angular/core';
import { forEach } from 'ramda';

@Component({
  selector: 'data-table-body',
  templateUrl: './data-table-body.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableBodyComponent {
  @Input() public columns: any[];

  @Input() public detailColumns: any[];
  @Input() public detailProp: string;
  @Input() public isDetailView: boolean;
  @Input() public actionableErrorText: string;

  @Input() public rows: any[];
  @Input() public noResultsMessage: string;
  @Input() public isLoading: boolean;
  @Input() public showCheckboxes: boolean;
  @Input() public rowIdProp: string;
  @Input() public disableIndividualRowAttribute: string;

  @Output() public onRowClick = new EventEmitter<Object>();
  @Output() public onCheckboxClick = new EventEmitter<any>();
  @Output() public errorTextClick = new EventEmitter<any>();
  @Output() public onDeleteClick = new EventEmitter<any>();
  @Output() public onButtonClick = new EventEmitter<any>();
  @Output() public onExternalLinkClick = new EventEmitter<any>();

  public rowClicked(rowData: any) {
    if (!this.shouldDisableRow(rowData)) {
      this.onRowClick.emit(rowData);
    }
  }

  public openDetail(rowData) {
    rowData['open'] = !rowData.open;
  }

  public checkboxClick(row: any) {
    let lastRow = {}; // Only use last row with matching id to send consistent data
    forEach((dr) => {
      if (dr[this.rowIdProp] === row[this.rowIdProp]) {
        dr['state'] = row.state; // Make all rows with same id be the same state
        lastRow = dr;
      }
    })(this.rows);
    this.onCheckboxClick.emit(lastRow);
  }

  public shouldDisableRow(row: any) {
    return row[this.disableIndividualRowAttribute];
  }

  public isDataAvailable() {
    return this.rows
      && this.rows.length
      && this.rows.length > 0;
  }

  public errorTextClicked() {
    this.errorTextClick.emit();
  }

  public getFlex() {
    return this.showCheckboxes ? '55px' : '25px';
  }

  public deleteClicked(row) {
    this.onDeleteClick.emit(row);
  }

  public buttonClicked(row, id) {
    this.onButtonClick.emit({row, id});
  }

  public externalLinkClicked(row) {
    this.onExternalLinkClick.emit(row);
  }
}
