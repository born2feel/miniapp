import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiTitle } from '@taiga-ui/core';
import { TuiBadge, TuiProgress } from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';
import { Client } from '../../api/profile.types';
import { SALON_CONFIG } from '../../core/salon.config';
import { SessionStore } from '../../core/session.store';
import { MESSENGER_PLATFORM } from '../../platform/messenger-platform';
import { ErrorStateComponent } from '../../shared/error-state.component';
import { PhonePipe } from '../../shared/format.pipes';
import { SkeletonListComponent } from '../../shared/skeleton-list.component';

interface MenuItem {
  link: string;
  icon: string;
  title: string;
  hint: string;
}

@Component({
  selector: 'app-home-page',
  imports: [
    CurrencyPipe,
    RouterLink,
    TuiBadge,
    TuiButton,
    TuiCell,
    TuiIcon,
    TuiProgress,
    TuiTitle,
    ErrorStateComponent,
    PhonePipe,
    SkeletonListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  protected readonly store = inject(SessionStore);
  private readonly platform = inject(MESSENGER_PLATFORM);
  private readonly router = inject(Router);

  protected readonly club = computed(() => this.store.client()?.club ?? null);

  /** Amount left to spend to reach the next level, USD. */
  protected readonly toNextLevel = computed(() => {
    const club = this.club();
    return club?.nextLevel ? Math.max(club.nextLevel.threshold - club.spent, 0) : 0;
  });

  protected readonly menu = computed<MenuItem[]>(() => {
    const profile = this.store.profile();
    if (!profile) {
      return [];
    }
    const upcoming = profile.visits.filter((visit) => visit.status === 'upcoming').length;
    const past = profile.visits.length - upcoming;
    return [
      { link: '/cards', icon: '@tui.credit-card', title: 'Bonus cards', hint: count(profile.cards.length) },
      { link: '/bookings', icon: '@tui.calendar-clock', title: 'My bookings', hint: upcoming ? count(upcoming) : 'no bookings' },
      { link: '/subscriptions', icon: '@tui.ticket', title: 'Packages', hint: count(profile.subscriptions.length) },
      { link: '/visits', icon: '@tui.history', title: 'Visits', hint: count(past) },
      { link: '/referral', icon: '@tui.users', title: 'Referral program', hint: 'invite your friends' },
    ];
  });

  protected book(): void {
    const client = this.store.client();
    this.platform.haptic();
    this.platform.openChat(
      SALON_CONFIG.bookingUsername,
      withSignature('Hello! I would like to book a treatment.', client),
    );
  }

  protected contactCare(): void {
    const client = this.store.client();
    this.platform.haptic();
    this.platform.openChat(
      SALON_CONFIG.careUsername,
      withSignature('Hello! I have a question about my service.', client),
    );
  }

  protected openOnlineBooking(): void {
    this.platform.haptic();
    this.platform.openLink(SALON_CONFIG.onlineBookingUrl);
  }

  protected signOut(): void {
    this.store.signOut();
    void this.router.navigateByUrl('/login');
  }
}

/**
 * Client signature for the prefilled message. The phone is left out: the text goes
 * into the t.me URL, and the salon already sees the sender's account.
 */
function withSignature(text: string, client: Client | null): string {
  return client ? `${text} ${client.firstName} ${client.lastName}.` : text;
}

function count(value: number): string {
  return value ? String(value) : 'none yet';
}
