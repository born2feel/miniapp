import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton } from '@taiga-ui/core';
import { TuiBadge, TuiRating } from '@taiga-ui/kit';
import { Visit, VisitRating } from '../../api/profile.types';
import { SessionStore } from '../../core/session.store';
import { MESSENGER_PLATFORM } from '../../platform/messenger-platform';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ErrorStateComponent } from '../../shared/error-state.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { SkeletonListComponent } from '../../shared/skeleton-list.component';

const PAGE_SIZE = 5;

@Component({
  selector: 'app-visits-page',
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    TuiBadge,
    TuiButton,
    TuiRating,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    SkeletonListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './visits.page.html',
  styleUrl: './visits.page.scss',
})
export class VisitsPage {
  protected readonly store = inject(SessionStore);
  private readonly platform = inject(MESSENGER_PLATFORM);

  /** Ratings given in this session. A real API would receive them via a POST request. */
  private readonly ratings = signal<Record<number, VisitRating>>({});
  private readonly limit = signal(PAGE_SIZE);

  private readonly pastVisits = computed(() =>
    (this.store.profile()?.visits ?? [])
      .filter((visit) => visit.status !== 'upcoming')
      .sort((a, b) => b.datetime.localeCompare(a.datetime)),
  );

  protected readonly visits = computed(() => this.pastVisits().slice(0, this.limit()));
  protected readonly total = computed(() => this.pastVisits().length);
  protected readonly hasMore = computed(() => this.limit() < this.total());

  protected ratingOf(visit: Visit): number {
    return this.ratings()[visit.id] ?? visit.rating ?? 0;
  }

  protected rate(visit: Visit, value: number): void {
    this.ratings.update((ratings) => ({ ...ratings, [visit.id]: value as VisitRating }));
    this.platform.haptic(value === 5 ? 'success' : 'light');
  }

  protected reviewLink(visit: Visit): string | null {
    return this.store.profile()?.reviewLinks[visit.branch.id] ?? null;
  }

  protected openReview(url: string): void {
    this.platform.haptic();
    this.platform.openLink(url);
  }

  protected showMore(): void {
    this.platform.haptic();
    this.limit.update((limit) => limit + PAGE_SIZE);
  }
}
