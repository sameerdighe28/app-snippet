import {
  Component, Inject, ViewEncapsulation, ChangeDetectionStrategy
} from '@angular/core';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { module, IDirectiveFactory } from 'angular';
import { MeetService } from './meet.service';
import { MeetConstants } from './meet.constants';
import { UserService } from '../core/user';
import { FilterService } from '../filter/filter.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../reducers';
import * as customer from '../actions/customer';
import * as filter from '../actions/filter';
import { AnalyticsService } from '../core/analytics/analytics.service';
import { NewFilter } from '../models/filters/new-filter.model';
import { toLower } from 'ramda';
import { Router } from '@angular/router';

@Component({
  selector: 'meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetComponent {
  public searchTerm: Observable<any>;
  public tableColumns: any[] = [];
  public meetTableColumns: any[];
  public tableColumns$: Observable<any[]>;
  public customers$: Observable<any>;
  public customersError$: Observable<any>;
  public loading$: Observable<any>;
  public currentPage$: Observable<number>;
  public pageSize$: Observable<number>;
  public totalElements$: Observable<number>;
  public numberOfPages$: Observable<number>;
  public allCustomerIds$: Observable<any[]>;
  public currentSort$: Observable<any>;
  public selectedView$: Observable<string>;
  public isKidsClub$: Observable<boolean>;
  public transactionRange$: Observable<number>;
  public isMobile$: Observable<boolean>;
  public screenSize$: Observable<string>;
  public pageSizeOptions: number[];
  public customerViewOptions: string[];
  public noCustomerMessage: string = '';
  public isCatering: boolean = false;
  public isLoading: boolean = false;
  public customerSelections: any[] = [];
  public primaryActionsIds: any[] = [];
  public subsequentActionsIds: any[] = [];
  public filters$: Observable<any>;
  public isHave$: Observable<any>;
  public currentNoResultsMessage: string = MeetConstants.currentNoResultsMessage;
  public isFilteringDisabled$: Observable<boolean>;
  public isFilteringEnabled$: Observable<boolean>;
  public isFeedbackViewEnabled$: Observable<boolean>;
  public isSavedGroupsEnabled$: Observable<boolean>;
  public selectedFilters$: Observable<NewFilter[]>;
  public selectedSavedFilters$: Observable<any>;
  public isInactiveView$: Observable<boolean>;
  public isFeedbackView$: Observable<boolean>;

  constructor(private ms: MeetService,
              public snackBar: MatSnackBar,
              private store: Store<fromRoot.State>,
              private us: UserService,
              private fs: FilterService,
              private router: Router,
              @Inject('$state') private state,
              @Inject('ROUTES') private ROUTES,
              private analytics: AnalyticsService,
              @Inject('ENGAGE_FROM') private ENGAGE_FROM,
              @Inject('dialogService') private ds,
              public dialog: MatDialog) {

    window.scroll(0, 0);
    this.searchTerm = store.select(fromRoot.getSearchTerm).take(1);
    this.currentPage$ = store.select(fromRoot.getPage);
    this.pageSize$ = store.select(fromRoot.getPageLimit);
    this.currentSort$ = store.select(fromRoot.getSortObj);
    this.selectedView$ = store.select(fromRoot.getView);
    this.isKidsClub$ = store.select(fromRoot.getIsKidsClub);

    this.noCustomerMessage = MeetConstants.noCustomerMessage;
    this.tableColumns$ = store.select(fromRoot.getFilteredMeetColumns);
    this.totalElements$ = store.select(fromRoot.getTotalCountOfCustomers);
    this.allCustomerIds$ = store.select(fromRoot.getAllCustomerIds);
    this.customers$ = store.select(fromRoot.getCustomers);
    this.customersError$ = store.select(fromRoot.getCustomersError);
    this.numberOfPages$ = store.select(fromRoot.getNumberOfPages);
    this.loading$ = store.select(fromRoot.getLoading);
    this.selectedFilters$ = store.select(fromRoot.getNewSelectedFilters);
    this.selectedSavedFilters$ = store.select(fromRoot.getSelectedSavedFilters);
    this.filters$ = store.select(fromRoot.getSelectedFilters);
    this.isHave$ = store.select(fromRoot.getIsHave);
    this.transactionRange$ = store.select(fromRoot.getTransRange);
    this.screenSize$ = store.select(fromRoot.getScreenSize);
    this.isMobile$ = this.screenSize$.map((size) => {
      return size === MeetConstants.extraSmall;
    });

    // setup engage-from
    this.subsequentActionsIds.push(this.ENGAGE_FROM.SUBSEQUENT_ACTIONS.MAKE_INACTIVE.id);

    // setup default table
    this.meetTableColumns = MeetConstants.allCustomersTableColumns;
    this.tableColumns = this.meetTableColumns;

    // setup paging
    this.pageSizeOptions = MeetConstants.pageSizeOptions;

    this.isFilteringDisabled$ = this.selectedView$.map((view) => {
      return view === MeetConstants.inactivesView ||
        view === MeetConstants.feedbackView;
    });

    this.selectedView$.subscribe((view) => {
      // TODO: Remove this when engage from is redesigned
      if (view === MeetConstants.inactivesView) {
        this.primaryActionsIds = [this.ENGAGE_FROM.PRIMARY_ACTIONS.MAKE_ACTIVE.id];
        this.subsequentActionsIds = [];
      } else {
        this.primaryActionsIds = [];
        this.subsequentActionsIds = [this.ENGAGE_FROM.SUBSEQUENT_ACTIONS.MAKE_INACTIVE.id];
      }
    });

    this.isInactiveView$ = this.selectedView$.map((view) => view === MeetConstants.inactivesView);
    this.isFeedbackView$ = this.selectedView$.map((view) => view === MeetConstants.feedbackView);

    this.isFilteringEnabled$ = store.select(fromRoot.getFeatureEnabled(MeetConstants.filtersFlag));
    this.isSavedGroupsEnabled$ =
        store.select(fromRoot.getFeatureEnabled(MeetConstants.savedGroupsFlag));
    this.isFeedbackViewEnabled$ =
        store.select(fromRoot.getFeatureEnabled(MeetConstants.feedbackFlag));
    this.isFeedbackViewEnabled$.take(1).subscribe((feedbackEnabled) => {
      this.customerViewOptions = MeetConstants.customerViews(feedbackEnabled);
    });
  }

  public makeInactive(customerIds: string[]) {
    this.store.dispatch(new customer.MakeInactiveAction(customerIds));
    this.openInactiveSnackBar(customerIds, 'Inactive');
  }

  public makeActive(customerIds: string[]) {
    this.store.dispatch(new customer.MakeActiveAction(customerIds));
    this.openInactiveSnackBar(customerIds, 'Active');
  }

  public updateView(view) {
    this.store.dispatch(new customer.ChangeViewAction(view));
    this.analytics.sendMParticleEvent(
      'Meet',
      'Meet Page View Changed',
      { View: view },
      `View: ${view}`
    );
  }

  public onSelection(sel) {
    this.customerSelections = sel;
  }

  public openCustomerProfile(customer) {
    window.scroll(0, 0);
    if (customer.source) {
      this.analytics.sendMParticleEvent(
          'Respond',
          'Comment Selected',
          {'Source': customer.source, 'Customer ID': customer.id},
          `Source: ${customer.source}. Customer ID: ${customer.id}`
      );
      let commentType = customer.source !== MeetConstants.cemMobileComment ?
                       customer.source : MeetConstants.cemComment;
      let routerProps = {
        id: customer.id,
        type: toLower(commentType),
        commentId: customer.surveyUid
      };
      this.state.go('commentDetails', routerProps);
    } else {
      this.analytics.sendMParticleEvent(
          'Meet',
          'Meet Customer Selected',
          {'Customer ID': customer.id},
          `Customer ID: ${customer.id}`
      );
      let routerProps = { id: customer.id };
      this.state.go('customerProfile', routerProps);
    }
  }

  public openFilters() {
    this.selectedFilters$.take(1).subscribe((filters: NewFilter[]) => {
      this.store.dispatch(new filter.SelectFilter('category'));
      if (filters && filters.length > 0) {
        this.router.navigate(['/edit-filter']);
      }
    });
  }

  public openSavedFilters() {
    this.analytics.sendMParticleEvent('meet', 'Saved Filter Clicked', '', ``);
    this.router.navigate(['/saved-filters'], { queryParams: { previousRoute: '/meet' } });
  }

  public onSearch(evt: any) {
    let search = evt.target.value;
    this.analytics.sendMParticleEvent(
      'Meet',
      'Meet Page Search',
      {'Search String': search},
      `Search String: ${search}`
    );
    this.store.dispatch(new customer.SearchAction(search));
  }

  public onPageSizeChange(newSize) {
    this.analytics.sendMParticleEvent(
      'Meet',
      'Meet Page Change Page Limit',
      {'Page Limit': newSize},
      `Page Limit: ${newSize}`
    );
    this.store.dispatch(new customer.ChangePageSizeAction(newSize));
  }

  public onPageChange(newPage) {
    this.analytics.sendMParticleEvent(
      'Meet',
      'Meet page # change',
      {Page: newPage + 1},
      `Page: ${newPage + 1}`
    );
    this.store.dispatch(new customer.ChangePageAction(newPage));
  }

  public clearFilters() {
    this.store.dispatch(new filter.ClearAllFilters());
  }

  public toggleFilter(filter) {
    this.store.dispatch(new filter.RemoveFilter(filter.id));
  }

  public onSort(newSort) {
    this.analytics.sendMParticleEvent(
      'Meet',
      'Meet Page Sort Occurred',
      {Sort: newSort.prop},
      `Sort: ${newSort.prop}`
    );
    this.store.dispatch(new customer.ChangeSortAction(newSort));
  }

  private openInactiveSnackBar(ids, activeText) {
    let customerText: string = '';
    if (ids.length === 1) {
      customerText = `1 customer has`;
    } else {
      customerText = `${ids.length} customers have`;
    }

    this.snackBar.open(
      `${customerText} been moved to the ${activeText} Customers list`,
      'Dismiss', {
        duration: 5000
      }
    );
  }
}

// TODO remove this when Angular upgrade is complete
module('Spotlight.downgrade.meet', [])
  .factory('ngrxStore', downgradeInjectable(Store))
  .factory('ngxAnalyticsService', downgradeInjectable(AnalyticsService))
  .factory('ngxMeetService', downgradeInjectable(MeetService))
  .factory('ngxUserService', downgradeInjectable(UserService))
  .factory('ngxFilterService', downgradeInjectable(FilterService))
  .directive('meet', downgradeComponent({
    component: MeetComponent,
  }) as IDirectiveFactory);
