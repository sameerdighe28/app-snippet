import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';

import { MeetComponent } from './meet.component';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    SharedModule
  ],
  declarations: [ MeetComponent ],
  exports: [ MeetComponent ],
  entryComponents: [ MeetComponent ]
})
export class MeetModule {}
