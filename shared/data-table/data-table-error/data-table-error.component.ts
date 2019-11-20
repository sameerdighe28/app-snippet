import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'data-table-error',
  templateUrl: './data-table-error.component.html'
})
export class DataTableErrorComponent {
  @Input() public errorText;
  @Input() public actionableText;

  @Output() public textClick = new EventEmitter<Object>();

  public textClicked() {
    this.textClick.emit();
  }
}
