import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/forkJoin';

import '../styles/style.scss';

import { APP_INITIALIZER, ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { createNewHosts } from '@angularclass/hmr';
import { MaterialModule } from './material.module';
import { NgxEditorModule } from 'ngx-editor';

import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { storeFreeze } from 'ngrx-store-freeze';

import { reducers } from './reducers';
import * as fromRoot from './reducers';

// Modules
import { DiscoverModule } from './discover/discover.module';
import { MarketLevelGiveawayModule } from './market-level-giveaway/market-level-giveaway.module';
import { CustomerProfileModule } from './customer-profile/customer-profile.module';
import { UnderstandModule } from './understand/understand.module';
import { EngageModule } from './engage/engage.module';
import { SettingsModule } from './settings/settings.module';
import { HelpModule } from './help/help.module';
import { EulaModule } from './eula/eula.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { MeetModule } from './meet/meet.module';
import { CareModule } from './care/care.module';
import { NavMenuModule } from './nav-menu/nav-menu.module';
import { NavBarModule } from './navbar/navbar.module';
import { AppRoutingModule } from './app-routing.module';
import { FilterModule } from './filter/filter.module';
import { NotificationsModule } from './notifications/notifications.module';

// Effects
import { LayoutEffects } from './effects/layout';
import { CustomerEffects } from './effects/customer';
import { CareEffects } from './effects/care';
import { FilterEffects } from './effects/filter';
import { ProfileEffects } from './effects/profile';
import { DiscoverEffects } from './effects/discover';
import { MarketEffects } from './effects/market';
import { EngagementEffects } from './effects/engagement';
import { SettingsEffects } from './effects/settings';
import { UserEffects } from './effects/user';
import { EulaEffects } from './effects/eula';
import { UnderstandEffects } from './effects/understand';
import { EngageEffects } from './effects/engage';
import { CalendarEffects } from './effects/calendar';
import { NotificationEffects } from './effects/notifications';
import { ActiveRewardsEffects } from './effects/active-rewards';

// Services
import { UserService } from './core/user';
import {
  calendarEventServiceFun, customerTransactionServiceFun,
  dialogServiceFun, engageFromFun, engageServiceFun,
  groupsServiceFun, routesFun,
  stateFun, templateServiceFun,
  transitionsFun, understandServiceFun,
} from './app.module.services';

// Components
import { AppComponent } from './app.component';
// TODO Move to NavBar module once we implement component level navbars
import { NavBarComponent } from './navbar/navbar.component';

export function getUser(userService: UserService) {
  return () => userService.setupUser();
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    StoreModule.forRoot(reducers, {
      metaReducers: process.env.NODE_ENV !== 'production' ? [storeFreeze] : [],
    }),
    HttpModule,
    HttpClientModule,
    StoreDevtoolsModule.instrument({ maxAge: 50 }),
    EffectsModule.forRoot([
      CustomerEffects,
      CareEffects,
      FilterEffects,
      LayoutEffects,
      ProfileEffects,
      DiscoverEffects,
      EngagementEffects,
      UnderstandEffects,
      EngageEffects,
      CalendarEffects,
      NotificationEffects,
      ActiveRewardsEffects,
      MarketEffects,
      SettingsEffects,
      UserEffects,
      EulaEffects
    ]),
    SharedModule.forRoot(),
    BrowserModule,
    UpgradeModule,
    AppRoutingModule,
    MaterialModule,
    NgxEditorModule,
    BrowserAnimationsModule,
    CoreModule,
    DiscoverModule,
    MarketLevelGiveawayModule,
    UnderstandModule,
    EngageModule,
    SettingsModule,
    HelpModule,
    CustomerProfileModule,
    FilterModule,
    EulaModule,
    MeetModule,
    CareModule,
    NavMenuModule,
    NavBarModule,
    NotificationsModule
  ],
  declarations: [
    AppComponent,
    NavBarComponent
  ],
  exports: [
    UpgradeModule,
    CustomerProfileModule,
  ],
  entryComponents: [
    NavBarComponent
  ],
  providers: [
    UserService,
    {
      provide: 'dialogService',
      useFactory: dialogServiceFun,
      deps: ['$injector'],
    },
    {
      provide: 'ENGAGE_FROM',
      useFactory: engageFromFun,
      deps: ['$injector'],
    },
    {
      provide: '$state',
      useFactory: stateFun,
      deps: ['$injector'],
    },
    {
      provide: '$transitions',
      useFactory: transitionsFun,
      deps: ['$injector'],
    },
    {
      provide: 'customerTransactionService',
      useFactory: customerTransactionServiceFun,
      deps: ['$injector'],
    },
    {
      provide: 'calendarEventService',
      useFactory: calendarEventServiceFun,
      deps: ['$injector'],
    },
    {
      provide: 'groupsService',
      useFactory: groupsServiceFun,
      deps: ['$injector'],
    },
    {
      provide: 'ROUTES',
      useFactory: routesFun,
      deps: ['$injector'],
    },
    {
      provide: 'understandService',
      useFactory: understandServiceFun,
      deps: ['$injector'],
    },
    {
      provide: 'engageService',
      useFactory: engageServiceFun,
      deps: ['$injector'],
    },
    {
      provide: 'templateService',
      useFactory: templateServiceFun,
      deps: ['$injector'],
    },
    { provide: APP_INITIALIZER, useFactory: getUser, deps: [UserService], multi: true }
  ],
})
export class AppModule {
  constructor(public appRef: ApplicationRef,
              private us: UserService,
              private _store: Store<fromRoot.State>) { }

  public ngDoBootstrap() {
    this.us.getUser();
  }

  /*
   * This will work where NG1 dependencies are completely stripped
   * which currently is no where as the navbar and loading remain
   * bootstrapped everywhere by NG1
   */
  public hmrOnInit(store) {
    if (!store || !store.rootState) {
      return;
    }

    // restore state by dispatch a SET_ROOT_STATE action
    if (store.rootState) {
      this._store.dispatch({
        type: 'SET_ROOT_STATE',
        payload: store.rootState,
      });
    }

    // if ('restoreInputValues' in store) { store.restoreInputValues(); }
    this.appRef.tick();
    Object.keys(store).forEach((prop) => delete store[prop]);
  }

  public hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    this._store.take(1).subscribe((s) => store.rootState = s);
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // store.restoreInputValues = createInputTransfer();
    // removeNgStyles();
  }

  public hmrAfterDestroy(store) {
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
