import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MESSENGER_PLATFORM } from '../platform/messenger-platform';

/** Root screens that do not need a Back button. */
const ROOT_URLS = new Set(['/', '/login']);

/** Shows the messenger's Back button on nested screens and navigates home. */
@Injectable({ providedIn: 'root' })
export class BackButtonService {
  private readonly router = inject(Router);
  private readonly platform = inject(MESSENGER_PLATFORM);

  private readonly goHome = (): void => {
    this.platform.haptic();
    void this.router.navigateByUrl('/');
  };

  init(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        const path = event.urlAfterRedirects.split(/[?#]/)[0];
        if (ROOT_URLS.has(path)) {
          this.platform.hideBackButton();
        } else {
          this.platform.showBackButton(this.goHome);
        }
      });
  }
}
