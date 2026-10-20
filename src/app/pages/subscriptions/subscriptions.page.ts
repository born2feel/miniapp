import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { TuiBadge, TuiProgress } from '@taiga-ui/kit';
import { SessionStore } from '../../core/session.store';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ErrorStateComponent } from '../../shared/error-state.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { SkeletonListComponent } from '../../shared/skeleton-list.component';

@Component({
  selector: 'app-subscriptions-page',
  imports: [
    DatePipe,
    DecimalPipe,
    TuiBadge,
    TuiIcon,
    TuiProgress,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    SkeletonListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subscriptions.page.html',
  styleUrl: './subscriptions.page.scss',
})
export class SubscriptionsPage {
  protected readonly store = inject(SessionStore);
  protected readonly subscriptions = computed(() => this.store.profile()?.subscriptions ?? []);
}
