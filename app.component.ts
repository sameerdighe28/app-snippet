import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AnalyticsService } from './core/analytics';

export let browserRefreshed = false;

@Component({
  selector: 'spotlight-app',
  template: `
    <router-outlet></router-outlet>
    <div id="main-content" ui-view></div>
  `
})
export class AppComponent implements OnDestroy {
  refreshSubscription: Subscription;

  constructor(private router: Router, private analytics: AnalyticsService) {
    this.refreshSubscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefreshed = !router.navigated;
      }

      if (event instanceof NavigationEnd) {
        this.analytics.logPageView(event.urlAfterRedirects, false);
      }
    });
  }

  ngOnDestroy() {
    this.refreshSubscription.unsubscribe();
  }
}
