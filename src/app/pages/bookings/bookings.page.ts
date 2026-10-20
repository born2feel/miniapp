import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { SessionStore } from '../../core/session.store';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ErrorStateComponent } from '../../shared/error-state.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { SkeletonListComponent } from '../../shared/skeleton-list.component';

@Component({
  selector: 'app-bookings-page',
  imports: [
    DatePipe,
    TuiIcon,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    SkeletonListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="My bookings" subtitle="Upcoming salon visits" />

    @switch (store.status()) {
      @case ('error') {
        <app-error-state />
      }
      @case ('ready') {
        <ul class="app-stack list">
          @for (visit of bookings(); track visit.id) {
            <li class="app-card booking">
              <time class="date" [attr.datetime]="visit.datetime">
                <span class="day">{{ visit.datetime | date: 'EEEE, MMMM d' }}</span>
                <span class="time">{{ visit.datetime | date: 'HH:mm' }}</span>
              </time>
              <p class="category">{{ visit.category }}</p>
              <p class="app-muted services">{{ visit.services.join(' · ') }}</p>
              <dl class="details">
                <div class="row">
                  <dt><tui-icon icon="@tui.map-pin" /><span class="app-visually-hidden">Branch</span></dt>
                  <dd>{{ visit.branch.name }}, {{ visit.branch.address }}</dd>
                </div>
                <div class="row">
                  <dt><tui-icon icon="@tui.user" /><span class="app-visually-hidden">Specialist</span></dt>
                  <dd>{{ visit.master.name }} · {{ visit.master.position }}</dd>
                </div>
              </dl>
            </li>
          } @empty {
            <li>
              <app-empty-state icon="@tui.calendar" title="No upcoming bookings">
                Book a treatment from the home screen.
              </app-empty-state>
            </li>
          }
        </ul>
      }
      @default {
        <app-skeleton-list [count]="3" [height]="148" />
      }
    }
  `,
  styles: `
    .list {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .booking {
      display: grid;
      gap: 0.25rem;
    }

    .date {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      font: var(--tui-font-text-m);
      font-weight: 600;
    }

    .day::first-letter {
      text-transform: uppercase;
    }

    .time {
      color: var(--tui-text-action);
      font-variant-numeric: tabular-nums;
    }

    .category {
      margin: 0.25rem 0 0;
      font: var(--tui-font-text-m);
    }

    .services {
      margin: 0;
    }

    .details {
      display: grid;
      gap: 0.25rem;
      margin: 0.5rem 0 0;
      font: var(--tui-font-text-s);
    }

    .row {
      display: flex;
      gap: 0.5rem;
    }

    dt {
      flex-shrink: 0;
      color: var(--tui-text-tertiary);
    }

    dd {
      margin: 0;
    }
  `,
})
export class BookingsPage {
  protected readonly store = inject(SessionStore);

  protected readonly bookings = computed(() =>
    (this.store.profile()?.visits ?? [])
      .filter((visit) => visit.status === 'upcoming')
      .sort((a, b) => a.datetime.localeCompare(b.datetime)),
  );
}
