import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DataTableComponent } from './data-table.component';
import { UserService } from '../../core/user/user.service';
import { MeetService } from '../../meet/meet.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';

describe('Data Table Component', () => {
  let comp: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let us = { selectedLocation$: new ReplaySubject(1) };
  let ms = { inactiveResponse$: new ReplaySubject(1) };
  // TODO setup airbnb shallow enzyme function
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataTableComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: UserService,
          useValue: us
        },
        {
          provide: MeetService,
          useValue: ms
        }
        ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  const columns = [{ prop: 'firstName', title: 'First Name' },
                   { prop: 'lastName', title: 'Last Name' }];

  const rows = [{ id: 2, firstName: 'Luke', lastName: 'Schmidt' },
                { id: 3, firstName: 'Jon', lastName: 'Cox' },
                { id: 1, firstName: 'Caleb', lastName: 'Taylor' }];

  it('should sort by the first column by default', () => {
    comp.frontEndPaging = true;
    comp.columns = columns;
    comp.rows = rows;
    fixture.detectChanges();

    const expected = [{ id: 1, firstName: 'Caleb', lastName: 'Taylor' },
                      { id: 3, firstName: 'Jon', lastName: 'Cox' },
                      { id: 2, firstName: 'Luke', lastName: 'Schmidt' }];

    expect(comp.rows).toEqual(expected);
  });

  it('should sort desc when sortChanged is clicked', () => {
    comp.frontEndPaging = true;
    comp.columns = columns;
    comp.rows = rows;
    fixture.detectChanges();

    const expected = [{ id: 1, firstName: 'Caleb', lastName: 'Taylor' },
                      { id: 2, firstName: 'Luke', lastName: 'Schmidt' },
                      { id: 3, firstName: 'Jon', lastName: 'Cox' }];

    comp.sortChange({ prop: 'lastName', order: 'desc'});
    fixture.detectChanges();

    expect(comp.rows).toEqual(expected);
  });

  it('should handle sorting of numbers', () => {
    comp.frontEndPaging = true;
    comp.columns = columns;
    comp.rows = rows;
    fixture.detectChanges();

    const expected = [{ id: 1, firstName: 'Caleb', lastName: 'Taylor' },
                      { id: 2, firstName: 'Luke', lastName: 'Schmidt' },
                      { id: 3, firstName: 'Jon', lastName: 'Cox' }];

    comp.sortChange({ prop: 'id', order: 'asc'});
    fixture.detectChanges();

    expect(comp.rows).toEqual(expected);
  });
});
