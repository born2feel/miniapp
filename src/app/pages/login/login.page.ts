import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiButtonLoading, TuiChip } from '@taiga-ui/kit';
import { DEMO_PHONES } from '../../api/profile.mocks';
import { SessionStore } from '../../core/session.store';
import { SALON_CONFIG } from '../../core/salon.config';
import { BrowserDemoPlatform } from '../../platform/browser-demo.platform';
import { MESSENGER_PLATFORM } from '../../platform/messenger-platform';
import { PhonePipe } from '../../shared/format.pipes';

@Component({
  selector: 'app-login-page',
  imports: [TuiButton, TuiButtonLoading, TuiChip, TuiIcon, PhonePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly platform = inject(MESSENGER_PLATFORM);
  private readonly store = inject(SessionStore);
  private readonly router = inject(Router);

  protected readonly salonName = SALON_CONFIG.name;
  protected readonly demo = this.platform instanceof BrowserDemoPlatform ? this.platform : null;
  protected readonly demoPhones = DEMO_PHONES;
  protected readonly requesting = signal(false);
  protected readonly declined = signal(false);

  protected async signIn(): Promise<void> {
    this.platform.haptic();
    this.requesting.set(true);
    this.declined.set(false);

    const phone = await this.platform.requestPhone();
    this.requesting.set(false);

    if (!phone) {
      this.declined.set(true);
      this.platform.haptic('error');
      return;
    }

    // The profile loads on the home screen, which shows skeletons and the error with Retry.
    void this.store.signIn(phone);
    await this.router.navigateByUrl('/');
  }
}
