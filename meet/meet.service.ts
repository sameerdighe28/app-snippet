import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';

import { ErrorHandlerService } from '../core/error-handler';
import { UserService } from '../core/user';

import { FindCustomerResponse } from '../models/find-customer-response.model';
import { Filters } from '../models/filters/filters.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MeetService {
  public customerResponse$: Observable<FindCustomerResponse>;
  public filter$: Observable<Filters>;
  public totalAllCustomers: number = 0;

  private customerResponseSource: Subject<FindCustomerResponse>;
  private filterSource: Subject<Filters>;

  private totalCustomers: number;
  private selectedFilters: Filters;

  constructor(private http: Http,
              private ehs: ErrorHandlerService,
              private us: UserService,
              @Inject('groupsService') private gs,
              @Inject('understandService') private uns) {
    this.customerResponseSource = new Subject();
    this.filterSource = new Subject();

    this.customerResponse$ = this.customerResponseSource.asObservable();
    this.filter$ = this.filterSource.asObservable();
  }

  public getAllCustomers() {

    let req = {
      limit: 20,
      page: 0,
      searchTerm: '',
      sort: 'firstName',
      sortOrder: 'asc',
      isCatering: false,
      isKidsClub: false
    };

    this.us.getSelectedLocation()
      .mergeMap((loc) => {
        return this.getCustomersFromHTTP(loc.locationNumber, req);
      })
      .subscribe((res) => {
        this.totalAllCustomers = res.totalElements;
        this.totalCustomers = res.totalElements;
        this.sendNewCustomers(res);
      }, (err) => {
        this.customerResponseSource.error(err);
      });
  }

  public updateSelectedFilters(filters: Filters) {
    this.selectedFilters = filters;
    this.filterSource.next(filters);
  }

  public getSelectedFilters() {
    return this.selectedFilters;
  }

  public getTotalCustomers() {
    return this.totalCustomers;
  }

  public getTableView(type: string) {
    return type;
  }

  private sendNewCustomers(cust) {
    this.customerResponseSource.next(cust);
  }

  private getCustomersFromHTTP(locationNumber, req) {
    let baseUrl = '/api/location/';
    let url = baseUrl + locationNumber + '/findCustomers';

    // let t0 = performance.now();
    return this.http.post(url, req)
      .map((res) => {
        let body = res.json();
        return body.responseObject || {};
      })
      .catch(this.ehs.handleError);
  }

  private toggleInactiveCustomerFromHTTP(locationNumber, req) {
    let baseUrl = '/api/location/';
    let url = baseUrl + locationNumber + '/toggleInactive';
    return this.http.post(url, req)
      .map((res) => {
        let body = res.json();
        return body.responseObject || {};
      })
      .catch(this.ehs.handleError);
  }

  private clearInactiveCache(location) {
    let baseUrl = '/api/cache/reset/';
    let url = baseUrl + location.locationNumber + '/inactiveCache';
    return this.http.get(url)
      .map(() => {
        return location;
      })
      .catch(this.ehs.handleError);
  }
}
