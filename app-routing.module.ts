import { EditFilterComponent } from './filter/edit/edit.component';
import { SelectComponent } from './filter/select/select.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlHandlingStrategy, UrlTree } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AttributesComponent } from './filter/attributes/attributes.component';
import { DiscoverComponent } from './discover/discover.component';
import { IndividualComponent } from './filter/individual/individual.component';
import { EngageComponent } from './engage/engage.component';
import {
  TemplateSelectionComponent
} from './engage/template-selection/template-selection.component';
import { CategoryComponent } from './engage/category/category.component';
import { ThemeSelectionComponent } from './engage/theme-selection/theme-selection.component';
import { EmailHeadlineSelectionComponent }
 from './engage/email-headline-selection/email-headline-selection.component';
import { CopyReviewComponent } from './engage/copy-review/copy-review.component';
import { OverlappingEngagementsComponent }
  from './engage/overlapping-engagements/overlapping-engagements.component';
import { PreviewPageComponent } from './engage/preview/preview-page.component';
import {
  CustomerSelectionComponent
} from './engage/customer-selection/customer-selection.component';
import { EngageSuccessComponent } from './engage/engage-success/engage-success.component';
import { SavedFiltersComponent } from './filter/saved/saved-filters.component';
import { UnderstandComponent } from './understand/understand.component';
import { MarketLevelGiveawayComponent }
  from './market-level-giveaway/market-level-giveaway.component';
import { DatePickerComponent } from './filter/date-picker/date-picker.component';
import { NoteComponent } from './customer-profile/note/note.component';
import { CareComponent } from './care/care.component';
import { ReportDetailsComponent } from './care/report-details/report-details.component';
import { CareSentEmailComponent } from './care/care-sent-email/care-sent-email.component';
import { ActionSelectionMobilePageComponent }
  from './care/action-selection-mobile-page/action-selection-mobile-page.component';
import { RespondComponent } from './care/respond/respond.component';
import { CareCategoriesComponent } from './care/care-categories/care-categories.component';
import { CareThemesComponent } from './care/care-themes/care-themes.component';
import { CareCopyComponent } from './care/care-copy/care-copy.component';
import { CarePreviewComponent } from './care/care-preview/care-preview.component';

export class Ng1Ng2UrlHandlingStrategy implements UrlHandlingStrategy {
  public shouldProcessUrl(url: UrlTree) {
    return url.toString() === '/'
      || url.toString().indexOf('/ngx') >= 0
      || url.toString().indexOf('/discover') >= 0
      || url.toString().indexOf('/care') >= 0
      || url.toString().indexOf('/individual') >= 0
      || url.toString().indexOf('/filter') >= 0
      || url.toString().indexOf('/saved-filters') >= 0
      || url.toString().indexOf('/edit-filter') >= 0
      || url.toString().indexOf('/attributes') >= 0
      || url.toString().indexOf('/date-picker') >= 0
      || url.toString().indexOf('/market-level-giveaway') >= 0
      || url.toString().indexOf('/note') >= 0
      || url.toString().indexOf('/understand') >= 0
      && !(url.toString().indexOf('/understand/detail') >= 0);
  }
  public extract(url: UrlTree) { return url; }
  public merge(url: UrlTree, whole: UrlTree) { return url; }
}

const routes: Routes = [
  { path: '', redirectTo: 'discover', pathMatch: 'full' },
  { path: 'discover', component: DiscoverComponent },
  { path: 'care', component: CareComponent },
  { path: 'care/details', component: ReportDetailsComponent },
  { path: 'care/sent-email', component: CareSentEmailComponent },
  { path: 'care/action-selection', component: ActionSelectionMobilePageComponent },
  { path: 'care/respond', component: RespondComponent },
  { path: 'care/categories', component: CareCategoriesComponent },
  { path: 'care/themes', component: CareThemesComponent },
  { path: 'care/copy', component: CareCopyComponent },
  { path: 'care/preview', component: CarePreviewComponent },
  { path: 'filter', component: SelectComponent },
  { path: 'saved-filters', component: SavedFiltersComponent },
  { path: 'edit-filter', component: EditFilterComponent },
  { path: 'attributes', component: AttributesComponent },
  { path: 'date-picker', component: DatePickerComponent },
  { path: 'individual', component: IndividualComponent },
  { path: 'ngx/engage', component: EngageComponent },
  { path: 'ngx/engage/template-selection', component: TemplateSelectionComponent },
  { path: 'ngx/engage/theme-selection', component: ThemeSelectionComponent },
  { path: 'ngx/engage/copy-review', component: CopyReviewComponent },
  { path: 'ngx/engage/category', component: CategoryComponent },
  { path: 'ngx/engage/overlapping-engagements', component: OverlappingEngagementsComponent },
  { path: 'ngx/engage/preview', component: PreviewPageComponent },
  { path: 'ngx/engage/success', component: EngageSuccessComponent },
  { path: 'ngx/engage/customer-selection', component: CustomerSelectionComponent },
  { path: 'understand', component: UnderstandComponent },
  { path: 'market-level-giveaway', component: MarketLevelGiveawayComponent },
  { path: 'note', component: NoteComponent },
  { path: 'ngx/engage/email-headline-selection', component: EmailHeadlineSelectionComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: UrlHandlingStrategy, useClass: Ng1Ng2UrlHandlingStrategy }
  ]
})
export class AppRoutingModule { }
