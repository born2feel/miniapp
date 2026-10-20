import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { SessionStore } from '../../core/session.store';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ErrorStateComponent } from '../../shared/error-state.component';
import { PluralPipe } from '../../shared/format.pipes';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { SkeletonListComponent } from '../../shared/skeleton-list.component';

@Component({
  selector: 'app-cards-page',
  imports: [
    DatePipe,
    DecimalPipe,
    TuiIcon,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    PluralPipe,
    SkeletonListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Bonus cards" subtitle="Bonus and gift certificate balances" />

    @switch (store.status()) {
      @case ('error') {
        <app-error-state />
      }
      @case ('ready') {
        <ul class="app-stack list">
          @for (card of cards(); track card.id) {
            <li class="card app-card" [attr.data-unit]="card.unit">
              <div class="card-head">
                <tui-icon [icon]="card.unit === 'rub' ? '@tui.gift' : '@tui.wallet'" />
                <span class="card-title">{{ card.title }}</span>
                <span class="card-number">{{ card.number }}</span>
              </div>
              <p class="balance">
                {{ card.balance | number: '1.0-0' }}
                @if (card.unit === 'rub') {
                  ₽
                } @else {
                  {{ card.balance | plural: 'bonus' : 'bonuses' }}
                }
              </p>
              @if (card.expiresAt) {
                <p class="expires">Valid until {{ card.expiresAt | date: 'MMMM d, yyyy' }}</p>
              }
            </li>
          } @empty {
            <li>
              <app-empty-state icon="@tui.credit-card" title="No cards yet">
                Your bonus card will appear after your first visit.
              </app-empty-state>
            </li>
          }
        </ul>
      }
      @default {
        <app-skeleton-list [count]="2" [height]="132" />
      }
    }
  `,
  styles: `
    .list {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .card {
      display: grid;
      gap: 0.75rem;
      color: #fff;
      background: linear-gradient(135deg, #7b5cd6, #c25ea5);

      &[data-unit='rub'] {
        background: linear-gradient(135deg, #2f8f83, #4cb0c9);
      }
    }

    .card-head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font: var(--tui-font-text-m);
    }

    .card-title {
      flex: 1;
      min-width: 0;
    }

    .card-number {
      opacity: 0.8;
      font-variant-numeric: tabular-nums;
    }

    .balance {
      margin: 0;
      font: var(--tui-font-heading-4);
    }

    .expires {
      margin: 0;
      opacity: 0.85;
      font: var(--tui-font-text-s);
    }
  `,
})
export class CardsPage {
  protected readonly store = inject(SessionStore);
  protected readonly cards = computed(() => this.store.profile()?.cards ?? []);
}
