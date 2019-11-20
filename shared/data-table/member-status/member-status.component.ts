import { Component, Input, ViewEncapsulation,
  ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'member-status',
  templateUrl: './member-status.component.html',
  styleUrls: ['./member-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberStatusComponent {
  @Input() public membership: any;
  @Input() public displayCfaOne: boolean = false;
  @Input() public isMobile: boolean = false;
}
