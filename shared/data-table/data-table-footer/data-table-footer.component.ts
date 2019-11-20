import {
  Component, Input, ViewEncapsulation, ChangeDetectionStrategy,
  Output, EventEmitter
} from '@angular/core';

@Component({
  selector: 'data-table-footer',
  templateUrl: './data-table-footer.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableFooterComponent {
  @Input() public pageSize: number;
  @Input() public pageSizeOptions: number[];
  @Input() public currentPage: number;

  @Input()
  set numberOfPages(numberOfPages) {
    this._numberOfPages = numberOfPages;
    this.pageNumberArr = this.getPageNumbers();
  }
  get numberOfPages() { return this._numberOfPages; }

  @Input() public totalElements: number;
  @Input() public isMobile: boolean;

  @Output() public onPageChange = new EventEmitter<number>();
  @Output() public onPageSizeChange = new EventEmitter<number>();

  private _numberOfPages: number;
  private pageNumberArr: number[];

  public getPageNumbers() {
    if (this.numberOfPages) {
      return Array.from(Array(this.numberOfPages), (x, i) => i + 1);
    } else {
      return [];
    }
  }

  public changeCurrentPage(newCount) {
    this.currentPage = parseInt(newCount, 10);
    this.onPageChange.emit(this.currentPage);
  }

  public pageSizeChange(newSize) {
    this.onPageSizeChange.emit(this.pageSize);
  }

  public pageLeft() {
    let newPage = Math.max(0, this.currentPage - 1);
    this.changeCurrentPage(newPage);
  }

  public pageRight() {
    let newPage = Math.min(this.numberOfPages, this.currentPage + 1);
    this.changeCurrentPage(newPage);
  }

  public hidePageOptions() {
    if (this.pageSizeOptions) {
      return this.totalElements <= this.pageSizeOptions[0];
    } else {
      return true;
    }
  }
}
