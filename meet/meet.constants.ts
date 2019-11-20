export class MeetConstants {
  public static get pageSizeOptions(): number[] {
    return [20, 40, 60];
  }

  public static get defaultPageSize(): number {
    return 20;
  }

  public static get extraSmall(): any {
    return 'xs';
  }

  public static customerViews(isFeedback: boolean): string[] {
    let view = [this.allCustomerView, this.cateringView, this.inactivesView];
    if (isFeedback) {
      view = [...view, this.feedbackView];
    }
    return view;
  }

  public static get allCustomerView(): string {
    return 'All Customers';
  }

  public static get cateringView(): string {
    return 'Catering Customers';
  }

  public static get inactivesView(): string {
    return 'Inactive Customers';
  }

  public static get feedbackView(): string {
    return 'Customer Feedback';
  }

  public static get cemMobileComment(): string {
    return 'CEM-Mobile';
  }

  public static get cemComment(): string {
    return 'CEM';
  }

  public static get cateringCustomersTableColumns(): object[] {
    return [{
      prop: 'firstName',
      title: 'First Name'
    }, {
      prop: 'lastName',
      title: 'Last Name'
    }, {
      prop: 'lastCateringDate',
      title: 'Last Catering Order Date'
    }, {
      prop: 'lastCateringTotal',
      title: 'Last Catering Order Total',
      type: 'currency'
    }, {
      prop: 'membership',
      title: 'Member Status',
      type: 'membership',
      sort: false
    }];
  }

  public static get inactivesTableColumns(): object[] {
    return [{
      prop: 'firstName',
      title: 'First Name',
      icon: 'inactive'
    }, {
      prop: 'lastName',
      title: 'Last Name'
    }, {
      prop: 'lastTransactionDate',
      title: 'Last Visit Date',
    }, {
      prop: 'birthDateFormatted',
      title: 'Birthday'
    }, {
      prop: 'membership',
      title: 'Member Status',
      type: 'membership',
      sort: false
    }];
  }

  public static get feedbackTableColumns(): object[] {
    return [{
      prop: 'fullName',
      title: 'Full Name',
      mobile: 'title',
      hide: true
    }, {
      prop: 'surveyDate',
      title: 'Submit Date',
      mobile: 'subtitle',
      type: 'DayDateTime'
    }, {
      prop: 'visitDate',
      title: 'Visit Date',
      type: 'DayDateTime'
    }, {
      prop: 'firstName',
      title: 'First Name',
    }, {
      prop: 'lastName',
      title: 'Last Name'
    }, {
      prop: 'source',
      title: 'Source'
    }];
  }

  public static get respondFeedbackTableColumns(): object[] {
    return [{
      prop: 'fullName',
      title: 'Full Name',
      mobile: 'title',
      hide: true
    }, {
      prop: 'surveyDate',
      title: 'Submit Date',
      mobile: 'subtitle',
      type: 'DayDateTime',
      icon: 'caresProspect',
      iconProp: 'caresProspect'
    }, {
      prop: 'visitDate',
      title: 'Visit Date',
      type: 'DayDateTime'
    }, {
      prop: 'firstName',
      title: 'First Name',
    }, {
      prop: 'lastName',
      title: 'Last Name'
    }, {
      prop: 'source',
      title: 'Source'
    }, {
      prop: 'updatedAt',
      title: 'Last Updated',
      type: 'DayDateTime'
    }];
  }

  public static get allCustomersTableColumns(): object[] {
    return [{
      prop: 'fullName',
      title: 'Full Name',
      mobile: 'title',
      hide: true
    }, {
      prop: 'firstName',
      title: 'First Name',
    }, {
      prop: 'lastName',
      title: 'Last Name'
    }, {
      prop: 'lastTransactionDate',
      title: 'Last Visit Date',
      mobile: 'subtitle',
      type: 'visitDate'
    }, {
      prop: 'birthDateFormatted',
      title: 'Birthday'
    }, {
      prop: 'membership',
      title: 'Member Status',
      type: 'membership',
      sort: false
    }];
  }

  public static get currentNoResultsMessage(): string {
    return 'There were no customers found for the requested criteria.';
  }

  public static get noCustomerMessage(): string {
    return `There are no customers associated with this location.
            As CFA One customers continue to visit your restaurant,
            they will display in Spotlight.`;
  }

  public static get filtersFlag(): string {
    return 'filters';
  }

  public static get savedGroupsFlag(): string {
    return 'savedGroups';
  }

  public static get feedbackFlag(): string {
    return 'feedback';
  }

  public static get disableSendingFlag(): string {
    return 'disableAllSending';
  }

  public static get caresType(): string {
    return 'CARES';
  }

  public static get cemType(): string {
    return 'CEM';
  }

  public static get legacyKidsClubFlag(): string {
    return 'legacyKidsClub';
  }
}
