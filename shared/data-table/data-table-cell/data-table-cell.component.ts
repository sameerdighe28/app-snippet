import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trim } from 'ramda';
import * as momentTimeZone from 'moment-timezone';

@Component({
  selector: 'data-table-cell',
  templateUrl: './data-table-cell.component.html'
})
export class DataTableCellComponent {
  @Input() public row;
  @Input() public col;
  @Input() public isMobile: boolean = false;

  @Output() public onDeleteClick = new EventEmitter<any>();
  @Output() public onButtonClick = new EventEmitter<any>();
  @Output() public onExternalLinkClick = new EventEmitter<any>();

  public getData(): string {
    return this.row[this.col.prop] ? this.row[this.col.prop] : '';
  }

  public getText(): string {
    return this.col.text ? this.col.text : '';
  }

  public getIcon(): boolean {
    if (!this.col.icon) {
      return false;
    }
    return this.col.iconProp ? this.row[this.col.iconProp] : true;
  }

  public getNumber(): number {
    return this.row[this.col.prop] ? this.row[this.col.prop] : 0;
  }

  public hasSecondStreetAddress(str) {
    return str && trim(str);
  }

  public trimData() {
    return trim(this.getData());
  }

  public getDisplayCfaOne() {
    return this.col.displayCfaOne ? this.col.displayCfaOne : false;
  }

  // required for Safari to handle Angular's date pipe correctly
  public formatDate(date) {
    return date.toString().replace(/\s/g, 'T');
  }

  // TODO: get rid of when we upgrade to Angular 5 and use datepipe timezone argument instead
  // TODO: write a test case for this if we don't plan on upgrading to angular 5 in the near future
  public formatUTCDate(utcDate, type) {
    // return formatted utc date in GMT timezone for html to display with no date pipe
    switch (type) {
      case 'UTCDate':
        return utcDate ? momentTimeZone.tz(utcDate, 'GMT').format('MM/DD/YYYY') : '';
      case 'UTCLongMonthDay':
        return utcDate ? momentTimeZone.tz(utcDate, 'GMT').format('MMMM DD') : '';
      default:
        return utcDate ? momentTimeZone.tz(utcDate, 'GMT') : '';
    }
  }

  public deleteClicked() {
    this.onDeleteClick.emit();
  }

  public buttonClicked() {
    this.onButtonClick.emit();
  }

  public externalLinkClicked() {
    this.onExternalLinkClick.emit();
  }
}
