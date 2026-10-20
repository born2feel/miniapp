import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { SessionStore } from '../../core/session.store';
import { ErrorStateComponent } from '../../shared/error-state.component';
import { PluralPipe } from '../../shared/format.pipes';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { SkeletonListComponent } from '../../shared/skeleton-list.component';

@Component({
  selector: 'app-referral-page',
  imports: [DecimalPipe, TuiIcon, ErrorStateComponent, PageHeaderComponent, PluralPipe, SkeletonListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Referral program" />

    @switch (store.status()) {
      @case ('error') {
        <app-error-state />
      }
      @case ('ready') {
        <section class="app-card intro">
          <tui-icon icon="@tui.heart-handshake" class="intro-icon" />
          <h2 class="intro-title">Invite friends, earn bonuses</h2>
          <p class="intro-text">
            Your friend gives the front desk your phone number on their first visit and gets 10% off
            any treatment. You receive 500 bonuses after that visit. Bonuses can cover up to 30% of
            the service price.
          </p>
        </section>

        @if (referral(); as referral) {
          <section class="counters" aria-label="Your results">
            <div class="app-card counter">
              <span class="counter-value">{{ referral.invitedCount }}</span>
              <span class="app-muted">
                {{ referral.invitedCount | plural: 'friend invited' : 'friends invited' }}
              </span>
            </div>
            <div class="app-card counter">
              <span class="counter-value">{{ referral.bonusesEarned | number: '1.0-0' }}</span>
              <span class="app-muted">
                {{ referral.bonusesEarned | plural: 'bonus earned' : 'bonuses earned' }}
              </span>
            </div>
          </section>
        }
      }
      @default {
        <app-skeleton-list [count]="1" [height]="200" />
        <div class="gap"></div>
        <app-skeleton-list [count]="1" [height]="96" />
      }
    }
  `,
  styles: `
    .intro {
      text-align: center;
    }

    .intro-icon {
      font-size: 2.5rem;
      color: var(--tui-text-action);
    }

    .intro-title {
      margin: 0.75rem 0 0.5rem;
      font: var(--tui-font-heading-6);
    }

    .intro-text {
      margin: 0;
      color: var(--tui-text-secondary);
      font: var(--tui-font-text-m);
    }

    .counters {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-block-start: 0.75rem;
    }

    .counter {
      display: grid;
      gap: 0.25rem;
      text-align: center;
    }

    .counter-value {
      font: var(--tui-font-heading-3);
      color: var(--tui-text-action);
    }

    .gap {
      height: 0.75rem;
    }
  `,
})
export class ReferralPage {
  protected readonly store = inject(SessionStore);
  protected readonly referral = computed(() => this.store.client()?.referral ?? null);
}
